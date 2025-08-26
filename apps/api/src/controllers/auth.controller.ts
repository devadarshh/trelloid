import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import prisma from "../prisma";
import { z } from "zod";

const userSchema = z.object({
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
      signingSecret: process.env.CLERK_WEBHOOK_SECRET_USER!,
    });

    const eventType = evt.type;

    if (eventType === "user.created") {
      const parseResult = userSchema.safeParse(evt.data);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid user data",
          errors: parseResult.error.format(),
        });
      }

      const data = parseResult.data;
      await prisma.user.create({
        data: {
          clerkId: data.id,
          firstName: data.first_name || null,
          lastName: data.last_name || null,
          email: data.email_addresses?.[0]?.email_address.toLowerCase() || "",
          imageUrl: data.image_url || null,
        },
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    }

    if (eventType === "user.updated") {
      const parseResult = userSchema.safeParse(evt.data);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid user data",
          errors: parseResult.error,
        });
      }

      const data = parseResult.data;
      await prisma.user.update({
        where: { clerkId: data.id },
        data: {
          firstName: data.first_name || null,
          lastName: data.last_name || null,
          email: data.email_addresses?.[0]?.email_address.toLowerCase() || "",
          imageUrl: data.image_url || null,
        },
      });

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
      });
    }

    if (eventType === "user.deleted") {
      const clerkId = (evt.data as any).id;

      await prisma.user.delete({
        where: { clerkId },
      });

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
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
