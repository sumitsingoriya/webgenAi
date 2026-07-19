
import crypto from "crypto";
import User from "../models/user.model.js";

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
                process.env.RAZORPAY_KEY_SECRET
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
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
