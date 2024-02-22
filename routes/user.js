import express from "express";
import { userController } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.get('/getusers', verifyToken, userController.getUsers);
router.put('/update/:id', [verifyToken], userController.updateUser);
router.delete('/delete/:id', [verifyToken], userController.deleteUser);

export const userRouter = router;