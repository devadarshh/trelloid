import { Request, Response } from "express";
import prisma from "../prisma/client";
import { createAuditLog } from "../utils/activityServices";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { z } from "zod";

// --------------------
// Zod Schemas
// --------------------
const createListSchema = z.object({
  title: z.string().min(1, "Title is required"),
  boardId: z.string().min(1, "Board ID is required"),
});

const updateListSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
  title: z.string().min(1, "Title is required"),
});

const deleteListSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
  boardId: z.string().min(1, "Board ID is required"),
});

const copyListSchema = z.object({
  listId: z.string().min(1, "List ID is required"),
});

const reorderListSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        order: z.number(),
      })
    )
    .nonempty("Items are required"),
  boardId: z.string().min(1, "Board ID is required"),
});

// --------------------
// Controller Functions
// --------------------
export const handleCreateList = async (req: Request, res: Response) => {
  try {
    const { title, boardId } = createListSchema.parse(req.body);

    const boardExists = await prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!boardExists)
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });

    const listExists = await prisma.list.findFirst({
      where: { boardId, title },
    });
    if (listExists)
      return res.status(400).json({
        success: false,
        message: "List with this title already exists in this board",
      });

    const newList = await prisma.list.create({
      data: { title, order: 0, board: { connect: { id: boardId } } },
    });

    await createAuditLog({
      entityTitle: newList.title,
      entityId: newList.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
      req,
    });

    return res.status(201).json({
      success: true,
      message: "List created successfully",
      data: newList,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err,
      });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const handleUpdateList = async (req: Request, res: Response) => {
  try {
    const { listId, title } = updateListSchema.parse(req.body);

    const listExists = await prisma.list.findUnique({
      where: { id: listId },
      select: { order: true, title: true },
    });
    if (!listExists)
      return res
        .status(404)
        .json({ success: false, message: "List not found" });

    if (listExists.title === title)
      return res
        .status(200)
        .json({ success: true, message: "No changes made", data: listExists });

    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: { title: title.trim(), order: listExists.order },
    });

    await createAuditLog({
      entityTitle: updatedList.title,
      entityId: updatedList.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "List updated successfully",
      data: updatedList,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err,
      });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const handleDeleteList = async (req: Request, res: Response) => {
  try {
    const { listId, boardId } = deleteListSchema.parse(req.body);

    const boardExists = await prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!boardExists)
      return res
        .status(404)
        .json({ success: false, message: "Board not found" });

    const listExists = await prisma.list.findUnique({ where: { id: listId } });
    if (!listExists)
      return res
        .status(404)
        .json({ success: false, message: "List not found" });

    const deletedList = await prisma.list.delete({ where: { id: listId } });

    await createAuditLog({
      entityTitle: deletedList.title,
      entityId: deletedList.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "List deleted successfully",
      data: deletedList,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err,
      });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const handleCopyList = async (req: Request, res: Response) => {
  try {
    const { listId } = copyListSchema.parse(req.body);

    const listExists = await prisma.list.findUnique({
      where: { id: listId },
      include: { cards: true },
    });
    if (!listExists)
      return res
        .status(404)
        .json({ success: false, message: "List not found" });

    const newList = await prisma.list.create({
      data: {
        title: `${listExists.title} (Copy)`,
        order: listExists.order + 1,
        boardId: listExists.boardId,
        cards: {
          create: listExists.cards.map((card) => ({
            title: card.title,
            description: card.description,
            order: card.order,
          })),
        },
      },
      include: { cards: true },
    });

    await createAuditLog({
      entityTitle: newList.title,
      entityId: newList.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
      req,
    });

    return res.status(201).json({
      success: true,
      message: "List copied successfully",
      data: newList,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err,
      });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getAllLists = async (req: Request, res: Response) => {
  try {
    const boardId = req.query.boardId as string;
    if (!boardId)
      return res
        .status(400)
        .json({ success: false, message: "Board ID is required" });

    const lists = await prisma.list.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
      include: { cards: { orderBy: { order: "asc" } } },
    });

    return res.status(200).json({ success: true, data: lists });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const handleListReorder = async (req: Request, res: Response) => {
  try {
    const { items, boardId } = reorderListSchema.parse(req.body);

    const transaction = items.map((list) =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: list.order },
      })
    );

    await prisma.$transaction(transaction);
    return res
      .status(200)
      .json({ success: true, message: "List order updated successfully." });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err,
      });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
