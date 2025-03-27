import { Router } from 'express';
import usersRouter from "./user.routes.js"
import couponsRouter from "./coupon.routes.js"


const router = Router();

router.use("/api/v1/users", usersRouter)
router.use("/api/v1/coupons", couponsRouter)



export default router;