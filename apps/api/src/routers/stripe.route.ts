import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { stripeRedirect } from "../controllers/stripe.controller";

const router = Router();

router.post("/stripe/redirect", requireAuth(), stripeRedirect);

export default router;
