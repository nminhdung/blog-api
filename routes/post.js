import express from "express";
import { postController } from "../controllers/postController.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();
router.post('/create-post', verifyToken, postController.createPost)
router.get('/get/:postId', verifyToken, postController.getSingleBlog);
router.get('/getposts', postController.getPosts);


export const postRouter = router;