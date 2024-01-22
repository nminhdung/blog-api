import express from "express";
import { userController } from "../controllers/userController.js";


const router = express.Router();

router.get('/test',userController.test)

export const userRouter = router;