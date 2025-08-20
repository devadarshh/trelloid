import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { z } from "zod";

const getAllOrgsSchema = z.object({});

export const syncOrganizationInDb = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET_ORG,
    });

    if (evt.type !== "organization.created") {
      return res
        .status(200)
        .send("Webhook received but not organization.created");
    }

    const data = evt.data as any;

    const organizationId: string = data.id;
    const name: string = data.name || "Unnamed Organization";
    const organizationImage: string | null = data.image_url ?? null;
    const userId: string = data.created_by;

    console.log({ organizationId, name, organizationImage, userId });

    const userExists = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const newOrg = await prisma.organization.create({
      data: {
        organizationId,
        name,
        organizationImage,
        users: { connect: { clerkId: userId } },
      },
    });

    await prisma.user.update({
      where: { clerkId: userId },
      data: { organizationId },
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: newOrg,
    });
  } catch (err: any) {
    console.error("Error syncing organization:", err);
    return res.status(400).json({
      success: false,
      error: "Invalid or unverified webhook",
    });
  }
};

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    getAllOrgsSchema.parse(req.query);

    const organizations = await prisma.organization.findMany({
      include: { users: true },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err,
      });
    }
    console.error("Error fetching organizations:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch organizations",
    });
  }
};
