import { Request, Response } from "express";
import prisma from "../prisma/client";

export const handleCreateBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.auth;
    console.log(userId);
    const {
      orgId,
      title,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
    } = req.body;

    const orgExists = await prisma.organization.findUnique({
      where: {
        organizationId: orgId,
      },
    });
    if (!orgExists) {
      console.log("Organization not found");
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }
    console.log("6");
    const existingBoard = await prisma.board.findFirst({
      where: { organizationId: orgId, title: title },
    });
    console.log("7");
    if (existingBoard) {
      return res.status(400).json({
        message: "Board with this title already exists in this organization",
      });
    }
    console.log("8");
    const newBoard = await prisma.board.create({
      data: {
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        organization: {
          connect: {
            organizationId: orgId,
          },
        },
      },
    });
    console.log("9");
    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: newBoard,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({
      success: false,
      error: "Server Error",
    });
  }
};
