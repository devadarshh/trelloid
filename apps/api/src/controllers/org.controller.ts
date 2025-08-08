import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { success } from "zod";

export const syncOrganizationInDb = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET_ORG,
    });
    if (evt.type === "organization.created") {
      const data = evt.data as any;

      const organizationId = data.id;
      const name = data.name;
      const organizationImage = data.image_url;
      const userId = data.created_by;

      console.log({
        organizationId,
        name,
        organizationImage,
        userId,
      });

      const userExists = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      if (!userExists) {
        return res
          .status(200)
          .json({ success: false, message: "User does not exist" });
      }

      await prisma.organization.create({
        data: {
          organizationId: organizationId,
          name: name,
          organizationImage: organizationImage,
          users: {
            connect: {
              clerkId: userId,
            },
          },
        },
      });

      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          organizationId: organizationId,
        },
      });
      return res.status(201).json({
        success: true,
        message: "Organization created successfully",
      });
    }
    return res
      .status(200)
      .send("Webhook received but not organization.created");
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: "Invalid or unverified webhook",
    });
  }
};
