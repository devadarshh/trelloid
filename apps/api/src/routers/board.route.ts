import express from "express";
import { requireAuth } from "@clerk/express";
import {
  handleCreateBoard,
  handleDeleteBoard,
  handleGetAllBoard,
} from "../controllers/board.controller";
const router = express.Router();

router.post("/create-board", requireAuth(), handleCreateBoard);
router.get("/boards", requireAuth(), handleGetAllBoard);
router.delete("/delete-board", requireAuth(), handleDeleteBoard);

export default router;
