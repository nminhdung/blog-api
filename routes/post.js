import express from "express";
import { postController } from "../controllers/postController.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();
router.get('/get/:postId', postController.getSingleBlog);
router.get('/getposts', postController.getPosts);
router.post('/comment/:postId',verifyToken, postController.commentPost);
router.delete('/delete-comment/:postId',verifyToken, postController.deleteComment);
router.post('/create-post', verifyToken, postController.createPost)
router.delete('/delete/:postId', verifyToken, postController.deletePost);
router.put('/update/:postId', verifyToken, postController.updatePost);


export const postRouter = router;