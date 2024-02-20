import { appError } from "../middlewares/appError.js"
import Post from "../models/post.js";
import { slugify } from "../utils/formatters.js";

const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to create a post'));
    };
    if (!req.body.title || !req.body.postContent) {
        return next(appError.errHandlerCustom(400, 'Please provide all required fields'));
    }
    const slug = slugify(req.body.title);

    try {
        const newPost = await Post.create({
            ...req.body,
            content: req.body.postContent,
            slug,
            userId: req.user.id
        })

        res.status(200).json({
            success: newPost ? true : false,
            dataPost: newPost ? newPost : null
        })
    } catch (error) {
        next(error)
    }
}
const getSingleBlog = async (req, res, next) => {
    const { postId } = req.params;
    try {
        const singleBlog = await Post.findById(postId).populate("userId", "username");
        res.status(200).json({
            rs: singleBlog ? singleBlog : null
        })
    } catch (error) {
        next(error)
    }
}



export const postController = {
    createPost,
    getSingleBlog
}