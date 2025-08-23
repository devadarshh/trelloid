import z from "zod";
import prisma from "../prisma";
import { Request, Response } from "express";

const MAX_FREE_BOARDS = 5;

const checkSubscriptionQuerySchema = z.object({
  orgId: z.string().nonempty(),
});

export const checkOrgSubscription = async (req: Request, res: Response) => {
  try {
    const parseResult = checkSubscriptionQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing orgId",
        errors: parseResult.error.format(),
      });
    }

    const { orgId } = parseResult.data;

    const subscription = await prisma.orgSubscription.findUnique({
      where: { orgId },
    });

    const isSubscribed = !!subscription;

    return res.status(200).json({ success: true, isSubscribed });
  } catch (err) {
    console.error("[CHECK_ORG_SUBSCRIPTION_ERROR]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const incrementAvailableCount = async (orgId: string) => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

  if (orgLimit) {
    await prisma.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
    });
  }
};

export const decreaseAvailableCount = async (orgId: string) => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

  if (orgLimit) {
    if (orgLimit.count < MAX_FREE_BOARDS) {
      await prisma.orgLimit.update({
        where: { orgId },
        data: { count: orgLimit.count + 1 },
      });
    }
  } else {
    await prisma.orgLimit.create({ data: { orgId, count: 1 } });
  }
};

export const hasAvailableCount = async (orgId: string): Promise<boolean> => {
  const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });
  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
};

export const handleGetAvailableCount = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.query;

    if (!orgId || typeof orgId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    let orgLimit = await prisma.orgLimit.findUnique({
      where: { orgId },
    });

    if (!orgLimit) {
      orgLimit = await prisma.orgLimit.create({
        data: {
          orgId,
          count: 0,
        },
      });
    }

    const count = orgLimit.count;
    const remaining = Math.max(MAX_FREE_BOARDS - count, 0);

    console.log("Available count:", { orgId, count, remaining });

    return res.status(200).json({
      success: true,
      count,
      remaining,
    });
  } catch (error) {
    console.error("[GET_AVAILABLE_COUNT_ERROR]", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
