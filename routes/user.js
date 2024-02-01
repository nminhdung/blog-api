import express from "express";
import { userController } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.put('/update/:id',[verifyToken],userController.updateUser);
router.get('/test',userController.test);

export const userRouter = router;