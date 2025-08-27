import { verifyWebhook } from "@clerk/express/webhooks";
import { Request, Response } from "express";
import prisma from "../prisma";
import { z } from "zod";

const OrgCreatedSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  created_by: z.string(),
});

const OrgUpdatedSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
});

const OrgDeletedSchema = z.object({
  id: z.string(),
});

export const syncOrganizationInDb = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET_ORG,
    });

    if (evt.type === "organization.created") {
      const data = OrgCreatedSchema.parse(evt.data);

      const organizationId = data.id;
      const name = data.name || "Unnamed Organization";
      const organizationImage = data.image_url ?? null;
      const userId = data.created_by;

      const userExists = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      if (!userExists) {
        return res
          .status(400)
          .json({ success: false, message: "User does not exist" });
      }
      const newOrg = await prisma.organization.upsert({
        where: { organizationId },
        update: {
          name,
          organizationImage,
        },
        create: {
          organizationId,
          name,
          organizationImage,
        },
      });

      await prisma.user.update({
        where: { clerkId: userId },
        data: { organizationId: newOrg.id },
      });
      return res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: newOrg,
      });
    }

    if (evt.type === "organization.updated") {
      const data = OrgUpdatedSchema.parse(evt.data);

      const organizationId = data.id;
      const name = data.name || "Unnamed Organization";
      const organizationImage = data.image_url ?? null;

      const updatedOrg = await prisma.organization.update({
        where: { organizationId },
        data: { name, organizationImage },
      });

      return res.status(200).json({
        success: true,
        message: "Organization updated successfully",
        data: updatedOrg,
      });
    }

    if (evt.type === "organization.deleted") {
      const data = OrgDeletedSchema.parse(evt.data);
      const organizationId = data.id;

      await prisma.user.updateMany({
        where: { organizationId },
        data: { organizationId: null },
      });

      await prisma.orgLimit.deleteMany({ where: { orgId: organizationId } });
      await prisma.orgSubscription.deleteMany({
        where: { orgId: organizationId },
      });

      await prisma.organization.delete({
        where: { organizationId },
      });

      return res.status(200).json({
        success: true,
        message: "Organization deleted successfully",
      });
    }

    return res.status(200).send("Webhook received but not handled event");
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      console.error(" Validation error:", err);
      return res.status(400).json({
        success: false,
        message: "Payload validation failed",
        errors: err,
      });
    }

    console.error("Error syncing organization:", err);
    return res.status(400).json({
      success: false,
      error: "Invalid or unverified webhook",
    });
  }
};
