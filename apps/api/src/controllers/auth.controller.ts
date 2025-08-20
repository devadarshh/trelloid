import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { z } from "zod";

const userCreatedSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email_addresses: z
    .array(
      z.object({
        email_address: z.string().email(),
      })
    )
    .optional(),
  image_url: z.string().optional(),
});

export const syncUserInDB = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET_USER,
    });

    const eventType = evt.type;

    if (eventType === "user.created") {
      const parseResult = userCreatedSchema.safeParse(evt.data);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid user data",
          errors: parseResult.error.format(),
        });
      }

      const data = parseResult.data;
      const clerkId = data.id;
      const firstName = data.first_name || null;
      const lastName = data.last_name || null;

      const email: string =
        data.email_addresses?.[0]?.email_address.toLowerCase() || "";

      const imageUrl = data.image_url || null;

      console.log("[CLERK_USER_CREATED]", {
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

    return res.status(200).json({
      success: true,
      message: `Webhook received but ignored: ${eventType}`,
    });
  } catch (err: any) {
    console.error("[CLERK_WEBHOOK_ERROR]", err);
    return res.status(400).json({
      success: false,
      error: "Invalid or unverified webhook",
    });
  }
};
