import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getAllLists,
  handleCopyList,
  handleCreateList,
  handleDeleteList,
  handleListReorder,
  handleUpdateList,
} from "../controllers/list.controller";
const router = express.Router();

router.post("/create-list", requireAuth(), handleCreateList);
router.post("/copy-list", requireAuth(), handleCopyList);
router.get("/lists", requireAuth(), getAllLists);
router.delete("/delete-list", requireAuth(), handleDeleteList);
router.put("/update-list", requireAuth(), handleUpdateList);
router.put("/update-list", requireAuth(), handleUpdateList);
router.put("/lists/reorder", requireAuth(), handleListReorder);

export default router;
