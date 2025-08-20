import { Request, Response } from "express";
import prisma from "../prisma/client";
import { stripe } from "../utils/stripe";
import { absoluteUrl } from "../utils/absoluteUrl";

export const stripeRedirect = async (req: Request, res: Response) => {
  try {
    const { orgId, user } = req.body;

    if (!orgId || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const settingsUrl = absoluteUrl(`/organization/${orgId}`);
    let url = "";

    const orgSubscription = await prisma.orgSubscription.findUnique({
      where: { orgId },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Trelloid Pro",
                description: "Unlimited boards for your organization",
              },
              unit_amount: 2000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });

      url = stripeSession.url || "";
    }

    return res.json({ data: url });
  } catch (error) {
    console.error("Stripe Redirect Error:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};
