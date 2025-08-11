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
