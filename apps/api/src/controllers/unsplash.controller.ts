import { Request, Response } from "express";
import { unsplash } from "../utils/unsplash";
import { z } from "zod";

// Zod schema for query parameters (optional if you want dynamic collection or count)
const getImagesQuerySchema = z.object({
  collectionIds: z
    .string()
    .optional()
    .transform((val) => val?.split(",") || ["317099"]),
  count: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 9)),
});

export const getUnsplashImages = async (req: Request, res: Response) => {
  try {
    const { collectionIds, count } = getImagesQuerySchema.parse(req.query);

    const response = await unsplash.photos.getRandom({
      collectionIds,
      count,
    });

    if (response.type === "error") {
      console.error("[UNSPLASH_API_ERROR]", response.errors);
      return res.status(502).json({
        success: false,
        message: "Failed to fetch images from Unsplash",
        errors: response.errors,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: response.response,
    });
  } catch (error: any) {
    console.error("[UNSPLASH_FETCH_ERROR]", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error?.message || "Unknown error",
    });
  }
};
