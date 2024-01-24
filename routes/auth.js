import express from "express";
import { authController } from "../controllers/authController.js";
const router = express.Router();

router.post('/signup', authController.signUp)
router.post('/signin', authController.signIn)
// router.post('/google', authController.google)
// router.get('/signout', authController.signOut)

export const authRouter = router;