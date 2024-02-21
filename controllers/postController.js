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

const getPosts = async (req, res, next) => {
    try {
        let filterGetPosts = {}
        const start = parseInt(req.query.start) || 0;
        const limit = parseInt(req.query.limit) || process.env.LIMIT;
        const sortDir = req.query.sort === 'asc' ? 1 : -1;
        if (req.query.userId) {
            filterGetPosts.userId = req.query.userId;
        };
        if (req.query.category) {
            filterGetPosts.category = req.query.category;
        };
        if (req.query.userId) {
            filterGetPosts.userId = req.query.userId
        }
        if (req.query.slug) {
            filterGetPosts.slug = req.query.slug;
        };
        let querySearch = {};

        if (req.query.searchTerm) {
            delete querySearch.searchTerm;
            querySearch = {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }
        }

        const posts = await Post.find({ ...filterGetPosts, ...querySearch }).sort({ updated: sortDir }).skip(start).limit(limit);
        res.status(200).json({
            success: posts ? true : false,
            result: posts ? posts : []
        });
    } catch (error) {
        next(appError.errHandlerCustom(401, 'No post found'));
    }
}
const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to delete this post '));
    }
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({
            success: deletedPost ? true : false,
            mes: deletedPost ? "Deleted successfully" : "Failed"
        })
    } catch (error) {
        next(appError.errHandlerCustom(403, 'Something went wrong!!'))
    }
}
const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to update this post '));
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.postContent,
                category: req.body.category,
                image: req.body.image
            }
        }, { new: true });
        res.status(200).json({
            success: updatedPost ? true : false,
            mes: updatedPost ? "Updated successfully" : "Failed",
            result: updatedPost ? updatedPost : null
        })
    } catch (error) {
        next(appError.errHandlerCustom(403, 'Something went wrong!!'))
    }
}
export const postController = {
    createPost,
    getSingleBlog,
    getPosts,
    deletePost,
    updatePost
}