import { Request, Response } from "express";
import prisma from "../prisma/client";

export const handleCreateList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, boardId } = req.body;
    console.log(title);
    console.log(boardId);

    const boardExists = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });
    if (!boardExists) {
      console.log("Board not found");
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const listExists = await prisma.list.findFirst({
      where: {
        boardId: boardId,
        title: title,
      },
    });

    if (listExists) {
      return res.status(400).json({
        message: "List with this title already exists in this Boards",
      });
    }
    const newList = await prisma.list.create({
      data: {
        title,
        order: 0, // default order, can be updated later
        board: {
          connect: {
            id: boardId,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "List created successfully",
      data: newList,
    });
  } catch (error: any) {
    console.error("Error adding list:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add list",
      error: error.message,
    });
  }
};

export const getAllLists = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const boardId = req.query.boardId as string;
    console.log("Fetching lists for boardId:", boardId);

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "Board ID is required",
      });
    }

    const lists = await prisma.list.findMany({
      where: {
        boardId: String(boardId),
      },
      orderBy: {
        order: "asc",
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
    console.log(lists);

    return res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error: any) {
    console.error("Error Loading lists:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to Load lists",
      error: error.message,
    });
  }
};

export const handleDeleteList = async (req: Request, res: Response) => {
  try {
    const { boardId, listId } = req.body;

    console.log(boardId, listId);

    if (!boardId) {
      return res.status(400).json({
        success: false,
        message: "Board ID is required",
      });
    }

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "List ID is required",
      });
    }

    const boardExists = await prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!boardExists) {
      return res.status(404).json({
        success: false,
        message: "Board  not found",
      });
    }

    const listExists = await prisma.list.findUnique({
      where: {
        id: listId,
      },
    });

    if (!listExists) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    const deleteList = await prisma.list.delete({
      where: { id: listId },
    });

    return res.status(200).json({
      success: true,
      message: "List is Deleted",
      data: deleteList,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: "Server Error",
    });
  }
};
export const handleUpdateList = async (req: Request, res: Response) => {
  try {
    const { listId, title } = req.body;

    console.log(listId);
    console.log(title);

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "List ID is required",
      });
    }

    const listExists = await prisma.list.findUnique({
      where: {
        id: listId,
      },
      select: { order: true, title: true },
    });

    if (!listExists) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    if (listExists.title === title) {
      return res.status(200).json({
        success: true,
        message: "No changes made",
        data: listExists,
      });
    }
    const updateList = await prisma.list.update({
      where: { id: listId },
      data: {
        title: title.trim(),
        order: listExists?.order,
      },
    });
    return res.status(200).json({
      success: true,
      message: "List  is Updated",
      data: updateList,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const handleCopyList = async (req: Request, res: Response) => {
  try {
    const { listId } = req.body;

    console.log(listId);

    if (!listId) {
      return res.status(400).json({
        success: false,
        message: "List ID is required",
      });
    }

    const listExists = await prisma.list.findUnique({
      where: { id: listId },
      include: { cards: true },
    });

    if (!listExists) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }
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
    return res.status(201).json({
      success: true,
      message: "Copy List created successfully",
      data: newList,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: "Server Error",
    });
  }
};
