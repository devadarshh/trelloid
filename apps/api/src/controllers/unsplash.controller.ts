import { unsplash } from "../utils/unsplash";
import { Request, Response } from "express";

export const getUnsplashImages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const collectionIds = ["317099"];
    const count = 9;
    const response = await unsplash.photos.getRandom({
      collectionIds,
      count,
    });
    if (response.type === "error") {
      return res.status(500).json({ error: response.errors });
    }
    res.json(response.response);
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
