import express from "express";

import isAuth from "../middlewares/isAuth.js";

import {
    billing,
    verifyPayment,
} from "../controllers/billing.controller.js";

const billingRouter = express.Router();

// Create Razorpay Order
billingRouter.post("/", isAuth, billing);

// Verify Razorpay Payment
billingRouter.post("/verify", isAuth, verifyPayment);

export default billingRouter;

