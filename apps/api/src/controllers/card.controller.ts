import { Request, Response } from "express";
import prisma from "../prisma";

import { createAuditLog } from "../utils/activityServices";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { z } from "zod";

const createCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  listId: z.string().min(1, "List ID is required"),
});

const updateCardSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
  title: z.string().optional(),
  description: z.string().optional(),
});

const deleteCardSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
});

const copyCardSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
});

const reorderCardSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        order: z.number(),
        listId: z.string(),
      })
    )
    .nonempty("Items are required"),
  boardId: z.string().min(1, "Board ID is required"),
});

export const handleCreateCard = async (req: Request, res: Response) => {
  try {
    const { title, listId } = createCardSchema.parse(req.body);

    const foundList = await prisma.list.findUnique({ where: { id: listId } });
    if (!foundList) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    const newCard = await prisma.card.create({
      data: {
        title,
        order: 0,
        list: { connect: { id: listId } },
      },
    });

    await createAuditLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: newCard.title,
      action: ACTION.CREATE,
      req,
    });

    return res.status(201).json({
      success: true,
      message: "Card created successfully",
      data: newCard,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors: err });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const handleUpdateCard = async (req: Request, res: Response) => {
  try {
    const { cardId, title, description } = updateCardSchema.parse(req.body);

    const cardExists = await prisma.card.findUnique({ where: { id: cardId } });
    if (!cardExists)
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });

    if (
      (title === undefined || title === cardExists.title) &&
      (description === undefined || description === cardExists.description)
    ) {
      return res.status(200).json({
        success: true,
        message: "No changes detected",
        data: cardExists,
      });
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        title: title ?? cardExists.title,
        description: description ?? cardExists.description,
      },
    });

    await createAuditLog({
      entityId: updatedCard.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: updatedCard.title,
      action: ACTION.UPDATE,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Card updated successfully",
      data: updatedCard,
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

export const handleDeleteCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = deleteCardSchema.parse(req.body);

    const cardExists = await prisma.card.findUnique({ where: { id: cardId } });
    if (!cardExists)
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });

    const deletedCard = await prisma.card.delete({ where: { id: cardId } });

    await createAuditLog({
      entityId: deletedCard.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: deletedCard.title,
      action: ACTION.DELETE,
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Card deleted successfully",
      data: deletedCard,
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

export const handleCopyCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = copyCardSchema.parse(req.body);

    const cardExists = await prisma.card.findUnique({ where: { id: cardId } });
    if (!cardExists)
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });

    const newCard = await prisma.card.create({
      data: {
        title: `${cardExists.title} (Copy)`,
        description: cardExists.description
          ? `${cardExists.description} (Copy)`
          : null,
        order: cardExists.order + 1,
        listId: cardExists.listId,
      },
    });

    await createAuditLog({
      entityId: newCard.id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: newCard.title,
      action: ACTION.CREATE,
      req,
    });

    return res.status(201).json({
      success: true,
      message: "Card copied successfully",
      data: newCard,
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

export const handleCardReorder = async (req: Request, res: Response) => {
  try {
    const { items, boardId } = reorderCardSchema.parse(req.body);

    const transaction = items.map((card) =>
      prisma.card.update({
        where: { id: card.id },
        data: { order: card.order, listId: card.listId },
      })
    );

    await prisma.$transaction(transaction);

    return res
      .status(200)
      .json({ success: true, message: "Card order updated successfully." });
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

export const getAllCards = async (req: Request, res: Response) => {
  try {
    const listId = req.query.listId as string;
    if (!listId)
      return res
        .status(400)
        .json({ success: false, message: "List ID is required" });

    const cards = await prisma.card.findMany({
      where: { listId },
      orderBy: { order: "asc" },
    });

    return res.status(200).json({ success: true, data: cards });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

export const getCardDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Card ID is required" });

    const card = await prisma.card.findUnique({
      where: { id },
      include: { list: { select: { title: true } } },
    });

    if (!card)
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });

    return res.status(200).json({ success: true, data: card });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
