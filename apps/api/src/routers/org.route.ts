import express from "express";
import { syncOrganizationInDb } from "../controllers/org.controller";
const router = express.Router();

router.post(
  "/organization",
  express.raw({ type: "application/json" }),
  syncOrganizationInDb
);

export default router;
