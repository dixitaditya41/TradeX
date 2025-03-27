import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

export const addCoupon = async (req, res) => {
    try {
        const { code, discount, category, expiresAt } = req.body;
        const userId = req.user._id; // Extract from authenticated user

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon already exists!" });
        }

        const newCoupon = new Coupon({
            code,
            discount,
            category,
            expiresAt,
            owner: userId
        });

        await newCoupon.save();

        // Add coupon ID to user's uploadedTokens
        await User.findByIdAndUpdate(userId, { $push: { uploadedTokens: newCoupon._id } });

        res.status(201).json({ message: "Coupon added successfully", coupon: newCoupon });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ status: "Available" }).populate("owner", "firstname lastname email");
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
export const exchangeCoupon = async (req, res) => {
    try {
        const { couponId } = req.body;
        const userId = req.user._id;

        const coupon = await Coupon.findById(couponId);
        if (!coupon || coupon.status !== "Available") {
            return res.status(404).json({ message: "Coupon not found or already exchanged" });
        }

        const user = await User.findById(userId);
        if (user.points < 2) {
            return res.status(403).json({ message: "Not enough points to exchange this coupon" });
        }

        // Deduct points and assign the coupon
        user.points -= 2;
        user.receivedTokens.push(couponId);
        await user.save();

        // Mark coupon as exchanged
        coupon.status = "Exchanged";
        await coupon.save();

        res.status(200).json({ message: "Coupon exchanged successfully", coupon });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};
export const deleteExpiredCoupons = async () => {
    try {
        const now = new Date();
        await Coupon.deleteMany({ expiresAt: { $lt: now }, status: "Available" });
        console.log("Expired coupons deleted successfully.");
    } catch (error) {
        console.error("Error deleting expired coupons:", error);
    }
};
const verifyCoupon = async (code) => {
    try {
        // Example: Call an external API (Replace with actual coupon provider API)
        const response = await axios.get(`https://couponapi.com/verify?code=${code}`);
        return response.data.isValid; // Assume API returns { isValid: true/false }
    } catch (error) {
        console.error("Coupon verification failed:", error.message);
        return false;
    }
};