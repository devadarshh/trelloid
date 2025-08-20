import express from "express";
import {
  getAllOrganizations,
  syncOrganizationInDb,
} from "../controllers/org.controller";
import { requireAuth } from "@clerk/express";
const router = express.Router();

router.post(
  "/create-organization",
  express.raw({ type: "application/json" }),
  syncOrganizationInDb
);
router.get("/organizations", requireAuth(), getAllOrganizations);

export default router;
