import { Request, Response } from "express";
import prisma from "../prisma/client";
import { createAuditLog } from "../utils/activityServices";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import {
  decreaseAvailableCount,
  incrementAvailableCount,
  hasAvailableCount,
} from "../controllers/orgLimits.controller";
import { z } from "zod";

const createBoardSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  title: z.string().min(1, "Title is required"),
  imageId: z.string().optional(),
  imageThumbUrl: z.string().optional(),
  imageFullUrl: z.string().optional(),
  imageLinkHTML: z.string().optional(),
});

const updateBoardSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
  title: z.string().min(1, "Title is required"),
});

const deleteBoardSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
});

const getBoardsQuerySchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
});

export const handleCreateBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parseResult = createBoardSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, errors: parseResult.error.format() });
    }

    const {
      orgId,
      title,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
    } = parseResult.data;
    const { userId } = req.auth;
    const canCreate = await hasAvailableCount(orgId);
    if (!canCreate) {
      return res.status(403).json({
        success: false,
        message: "You have reached the maximum number of free boards.",
      });
    }
    const orgExists = await prisma.organization.findUnique({
      where: { organizationId: orgId },
    });
    if (!orgExists)
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });

    const existingBoard = await prisma.board.findFirst({
      where: { organizationId: orgId, title },
    });
    if (existingBoard)
      return res.status(400).json({
        success: false,
        message: "Board with this title already exists",
      });
    const imageFullUrlSafe: string = imageFullUrl || "";
    const newBoard = await prisma.board.create({
      data: {
        title,
        imageId: imageId || "",
        imageThumbUrl: imageThumbUrl || "",
        imageFullUrl: imageFullUrlSafe,
        imageLinkHTML: imageLinkHTML || "",
        organization: { connect: { organizationId: orgId } },
      },
    });
    await decreaseAvailableCount(orgId);
    await createAuditLog({
      entityTitle: newBoard.title,
      entityId: newBoard.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
      req,
    });

    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error) {
    console.error("[CREATE_BOARD_ERROR]", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const handleGetAllBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parseResult = getBoardsQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, errors: parseResult.error.format() });
    }

    const { orgId } = parseResult.data;

    const orgExists = await prisma.organization.findUnique({
      where: { organizationId: orgId },
    });
    if (!orgExists)
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });

    const boards = await prisma.board.findMany({
      where: { organizationId: orgId },
    });

    return res.status(200).json({ success: true, data: boards });
  } catch (error) {
    console.error("[GET_ALL_BOARDS_ERROR]", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// DELETE BOARD
export const handleDeleteBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parseResult = deleteBoardSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, errors: parseResult.error.format() });
    }

    const { boardId } = parseResult.data;
    const { userId } = req.auth;

    const boardExists = await prisma.board.findUnique({
      where: { id: boardId },
      include: { organization: true },
    });
    if (!boardExists)
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });

    const deletedBoard = await prisma.board.delete({ where: { id: boardId } });
    await incrementAvailableCount(boardExists.organization.organizationId);
    await createAuditLog({
      entityTitle: deletedBoard.title,
      entityId: deletedBoard.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Board deleted successfully",
      data: deletedBoard,
    });
  } catch (error) {
    console.error("[DELETE_BOARD_ERROR]", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// UPDATE BOARD
export const handleUpdateBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parseResult = updateBoardSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ success: false, errors: parseResult.error.format() });
    }

    const { boardId, title } = parseResult.data;

    const boardExists = await prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!boardExists)
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });

    if (boardExists.title === title.trim()) {
      return res
        .status(200)
        .json({ success: true, message: "No changes made", data: boardExists });
    }

    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { title: title.trim() },
    });

    await createAuditLog({
      entityTitle: updatedBoard.title,
      entityId: updatedBoard.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.UPDATE,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Board updated successfully",
      data: updatedBoard,
    });
  } catch (error) {
    console.error("[UPDATE_BOARD_ERROR]", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
