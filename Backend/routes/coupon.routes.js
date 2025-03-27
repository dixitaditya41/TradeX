import express from "express";
import { addCoupon, getAllCoupons, exchangeCoupon,approveCoupon,rejectCoupon } from "../controllers/coupon.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addCoupon);
router.get("/all", getAllCoupons);
router.post("/exchange", authMiddleware, exchangeCoupon);
router.put("/approve/:couponId", authMiddleware, adminMiddleware, approveCoupon);
router.put("/reject/:couponId", authMiddleware, adminMiddleware, rejectCoupon);

export default router;
