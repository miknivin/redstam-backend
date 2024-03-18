import express from "express";
const router = express.Router();
import {
  stripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentControllers.js";
import { isAuthenticateUser } from "../middlewares/auth.js";

router
  .route("/payment/checkout_session")
  .post(isAuthenticateUser, stripeCheckoutSession);

router.route("/payment/webhook").post(stripeWebhook);
export default router;