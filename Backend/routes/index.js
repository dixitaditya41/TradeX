import { Router } from 'express';
import usersRouter from "./user.routes.js"



const router = Router();

router.use("/api/v1/users", usersRouter)



export default router;