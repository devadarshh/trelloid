import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getAllCards,
  getCardDetails,
  handleCreateCard,
} from "../controllers/card.controller";
const router = express.Router();

router.post("/create-card", requireAuth(), handleCreateCard);
router.get("/cards", requireAuth(), getAllCards);
router.get("/card/:id", requireAuth(), getCardDetails);

export default router;
