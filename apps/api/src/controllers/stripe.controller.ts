import { Request, Response } from "express";
import prisma from "../prisma";
import { stripe } from "../utils/stripe";
import { clerkClient } from "@clerk/express";
import Stripe from "stripe";

export const stripeRedirect = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.body;

    if (!orgId) {
      return res.status(400).json({ error: "Organization ID required" });
    }

    const authUser = (req as any).auth?.userId;
    if (!authUser) return res.status(401).json({ error: "Unauthorized" });

    const user = await clerkClient.users.getUser(authUser);
    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return res.status(400).json({ error: "User does not have an email" });
    }

    const frontendBase = process.env.FRONTEND_URL;
    if (!frontendBase) {
      return res
        .status(500)
        .json({ error: "FRONTEND_URL not set in environment" });
    }

    const frontendUrl = `${frontendBase.replace(/\/$/, "")}/organization/${orgId}`;
    let url = "";

    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: { orgId },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: frontendUrl,
      });
      url = stripeSession.url!;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: frontendUrl,
        cancel_url: frontendUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Trelloid Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 2000,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        metadata: { orgId },
      });
      url = stripeSession.url!;
    }

    return res.json({ data: url });
  } catch (error) {
    console.error("Stripe Redirect Error:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    return res.status(400).send("Stripe signature missing");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const orgId = session.metadata?.orgId;

    if (!orgId) {
      return res.status(400).send("Org ID is required");
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const stripeCurrentPeriodEnd = (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000)
      : null;

    if (event.type === "checkout.session.completed") {
      await prisma.orgSubscription.create({
        data: {
          orgId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd,
        },
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      await prisma.orgSubscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd,
        },
      });
    }

    res.status(200).send("Webhook received successfully");
  } catch (error) {
    console.error(" Stripe Webhook handling error:", error);
    res.status(500).send("Internal server error");
  }
};
