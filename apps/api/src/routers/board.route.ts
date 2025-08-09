import express from "express";
import { requireAuth } from "@clerk/express";
import { handleCreateBoard } from "../controllers/board.controller";
const router = express.Router();

router.post("/create-board", requireAuth(), handleCreateBoard);

export default router;
