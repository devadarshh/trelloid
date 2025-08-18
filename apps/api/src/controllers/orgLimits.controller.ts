import { Request, Response } from "express";
import prisma from "../prisma/client.js";

const MAX_FREE_BOARDS = 5;

// Define a custom type so req.user.orgId works
interface AuthenticatedRequest extends Request {
  user?: {
    orgId?: string;
  };
}

// Increment available boards for org
export const incrementAvailableCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orgId } = req.user || {};

    if (!orgId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

    if (orgLimit) {
      await prisma.orgLimit.update({
        where: { orgId },
        data: { count: orgLimit.count + 1 },
      });
    } else {
      await prisma.orgLimit.create({
        data: { orgId, count: 1 },
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("incrementAvailableCount error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Decrease available boards
export const decreaseAvailableCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orgId } = req.user || {};

    if (!orgId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

    if (orgLimit) {
      await prisma.orgLimit.update({
        where: { orgId },
        data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
      });
    } else {
      await prisma.orgLimit.create({
        data: { orgId, count: 1 },
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("decreaseAvailableCount error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Check if org has free slots left
export const hasAvailableCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orgId } = req.user || {};

    if (!orgId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

    const available = !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
    return res.json({ available });
  } catch (err) {
    console.error("hasAvailableCount error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get current count
export const getAvailableCount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { orgId } = req.user || {};

    if (!orgId) {
      return res.json({ count: 0 });
    }

    const orgLimit = await prisma.orgLimit.findUnique({ where: { orgId } });

    return res.json({ count: orgLimit ? orgLimit.count : 0 });
  } catch (err) {
    console.error("getAvailableCount error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
