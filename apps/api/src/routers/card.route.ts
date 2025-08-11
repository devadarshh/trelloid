import express from "express";
import { requireAuth } from "@clerk/express";
import { getAllCards, handleCreateCard } from "../controllers/card.controller";
const router = express.Router();

router.post("/create-card", requireAuth(), handleCreateCard);
router.get("/cards", requireAuth(), getAllCards);

export default router;
