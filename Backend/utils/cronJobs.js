import cron from "node-cron";
import { deleteExpiredCoupons } from "../controllers/coupon.controller.js";

// Schedule the cron job to run every day at midnight
cron.schedule("0 0 * * *", deleteExpiredCoupons);

console.log("⏳ Cron job scheduled: Deleting expired coupons every midnight.");
