import { Router } from "express";
import bodyParser from "body-parser";
import {
  stripeRedirect,
  stripeWebhook,
} from "../controllers/stripe.controller";

const router = Router();

router.post("/stripe/redirect", stripeRedirect);

router.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
