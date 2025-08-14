import { Request, Response } from "express";
import prisma from "../prisma/client";

export const handleCreateCard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, listId } = req.body;
    console.log(title);
    console.log(listId);

    const foundList = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });
    if (!foundList) {
      console.log("List not found");
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    const newCard = await prisma.card.create({
      data: {
        title,
        order: 0, // default order, can be updated later
        list: {
          connect: {
            id: listId,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Card created successfully",
      data: newCard,
    });
  } catch (error: any) {
    console.error("Error adding card:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add card",
      error: error.message,
    });
  }
};

export const getAllCards = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const listId = req.query.listId as string;
    console.log("Fetching lists for boardId:", listId);

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "List ID is required",
      });
    }

    const cards = await prisma.card.findMany({
      where: {
        listId: String(listId),
      },
      orderBy: {
        order: "asc",
      },
    });
    console.log(cards);

    return res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error: any) {
    console.error("Error Loading cards:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Load cards",
      error: error.message,
    });
  }
};

export const getCardDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Card ID is required" });
    }
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        list: {
          select: { title: true },
        },
      },
    });
    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    return res.status(200).json({ success: true, data: card });
  } catch (error: any) {
    console.error("Error fetching card:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
