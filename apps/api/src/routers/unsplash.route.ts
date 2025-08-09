import express from "express";
import { getUnsplashImages } from "../controllers/unsplash.controller";

const router = express.Router();

router.get("/images", getUnsplashImages);

export default router;
