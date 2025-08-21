import { Router } from "express";
import { requireAuth } from "@clerk/express";
import bodyParser from "body-parser";
import {
  stripeRedirect,
  stripeWebhook,
} from "../controllers/stripe.controller";

const router = Router();

router.post("/stripe/redirect", requireAuth(), stripeRedirect);

router.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
