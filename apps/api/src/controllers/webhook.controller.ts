import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import prisma from "../prisma/client";

export const handleRegisterUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;

    console.log("Webhook payload:", evt.data);
    if (evt.type === "user.created") {
      const data = evt.data as any;

      const clerkId = data.id;
      const firstName = data.first_name || null;
      const lastName = data.last_name || null;
      const email =
        data.email_addresses?.[0]?.email_address?.toLowerCase() || null;
      const imageUrl = data.image_url || null;

      console.log({
        clerkId,
        firstName,
        lastName,
        email,
        imageUrl,
      });

      await prisma.user.create({
        data: {
          clerkId,
          firstName,
          lastName,
          email,
          imageUrl,
        },
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    }
    return res.status(200).send("Webhook received but not user.created");
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: "Invalid or unverified webhook",
    });
  }
};
