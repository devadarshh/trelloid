import express from "express";
import { requireAuth } from "@clerk/express";
import { getAllLists, handleCreateList } from "../controllers/list.controller";
const router = express.Router();

router.post("/create-list", requireAuth(), handleCreateList);
router.get("/lists", requireAuth(), getAllLists);

export default router;
