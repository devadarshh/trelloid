import express from "express";
import { requireAuth } from "@clerk/express";
import {
  handleCreateBoard,
  handleDeleteBoard,
  handleGetAllBoard,
  handleUpdateBoard,
} from "../controllers/board.controller";
const router = express.Router();

router.post("/create-board", requireAuth(), handleCreateBoard);
router.get("/boards", requireAuth(), handleGetAllBoard);
router.put("/update-board", requireAuth(), handleUpdateBoard);
router.delete("/delete-board", requireAuth(), handleDeleteBoard);

export default router;
