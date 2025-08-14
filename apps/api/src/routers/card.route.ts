import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getAllCards,
  getCardDetails,
  handleCopyCard,
  handleCreateCard,
  handleDeleteCard,
  handleUpdateCard,
} from "../controllers/card.controller";
const router = express.Router();

router.post("/create-card", requireAuth(), handleCreateCard);
router.post("/copy-card", requireAuth(), handleCopyCard);
router.get("/cards", requireAuth(), getAllCards);
router.delete("/delete-card", requireAuth(), handleDeleteCard);
router.get("/card/:id", requireAuth(), getCardDetails);
router.put("/update-card", requireAuth(), handleUpdateCard);

export default router;
