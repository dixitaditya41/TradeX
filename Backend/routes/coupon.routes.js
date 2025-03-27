import express from "express";
import { addCoupon, getAllCoupons, exchangeCoupon } from "../controllers/coupon.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addCoupon);
router.get("/all", getAllCoupons);
router.post("/exchange", authMiddleware, exchangeCoupon);
router.put("/approve/:couponId", authMiddleware, adminMiddleware, approveCoupon);
router.put("/reject/:couponId", authMiddleware, adminMiddleware, rejectCoupon);

export default router;
