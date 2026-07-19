import crypto from "crypto";
import { PLANS } from "../config/plan.js";
import razorpay from "../config/razorpay.js";
import User from "../models/user.model.js";

// Create Razorpay Order
export const billing = async (req, res) => {
    try {
        const { planType } = req.body;

        const userId = req.user._id;
        const plan = PLANS[planType];

        if (!plan || plan.price === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid paid plan",
            });
        }

        const order = await razorpay.orders.create({
            amount: plan.price * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,

            notes: {
                userId: userId.toString(),
                credits: plan.credits.toString(),
                plan: planType,
            },
        });

        return res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.log("Billing Error:", error);

        return res.status(500).json({
            success: false,
            message: `Billing Error: ${error.message}`,
        });
    }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planType,
        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_SECRET_KEY
            )
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid Payment Signature",
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (planType === "pro") {
            user.credits += 500;
            user.plan = "pro";
        } else if (planType === "enterprise") {
            user.credits += 1000;
            user.plan = "enterprise";
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Payment Verified Successfully",
            user,
        });

    } catch (error) {
        console.log("Verify Payment Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

