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
        const singleBlog = await Post.findById(postId)
            .populate("userId", "username")
            .populate({
                path: 'comments',
                populate: {
                    path: 'postedBy',
                    select: 'username avatar'
                }
            });
        res.status(200).json({
            result: singleBlog ? singleBlog : null,
            success: singleBlog ? true : false,
            mes: singleBlog ? '' : "Can not found post"
        })
    } catch (error) {
        next(error)
    }
}

const getPosts = async (req, res, next) => {
    try {
        let filterGetPosts = {}
        const page = parseInt(req.query.page) || 1;
        const skip = +(page - 1) * 2;
        const limit = parseInt(req.query.limit) || 2;
        console.log(skip)
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
        console.log({ ...filterGetPosts, ...querySearch })
        const posts = await Post.find({ ...filterGetPosts, ...querySearch }).skip(skip).limit(limit).sort(`createdAt ${sortDir}`);
        const counts = await Post.find({ ...filterGetPosts, ...querySearch }).countDocuments();
        res.status(200).json({
            success: posts ? true : false,
            result: posts ? posts : [],
            counts
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

// lay postId, userId, content cua userId
// them userId vao` truong` comment cua post
const commentPost = async (req, res, next) => {
    const { postId } = req.params;

    const { comment, updatedAt } = req.body;

    if (!req.user) {
        return next(appError.errHandlerCustom(401, 'Unauthorized'));
    }

    if (comment?.length > 200) {
        return next(appError.errHandlerCustom(400, "You are not allow comment more than 200 characters"));
    }
    try {
        const post = await Post.findByIdAndUpdate(postId, {
            $push: { comments: { postedBy: req.user.id, content: comment, updatedAt } }
        }, { new: true });
        res.status(200).json({
            success: post ? true : false,
            mes: post ? "Commented successfully" : "Something went wrong!",

        })
    } catch (error) {
        next(error);
    }
}
const deleteComment = async (req, res, next) => {
    const { postId } = req.params;

    const { commentId } = req.body;

    const post = await Post.findById(postId);

    const validUserDeleteComment = post?.comments?.find
        (comment => comment.postedBy.toString() === req.user.id && commentId === comment._id.toString());
    if (validUserDeleteComment || req.user.isAdmin) {
        try {
            const updatePost = await Post.findByIdAndUpdate(postId, {
                $pull: { comments: { _id: commentId } }
            }, { new: true });
            res.status(200).json({
                success: updatePost ? true : false,
                mes: updatePost ? " Deleted  successfully" : "Something went wrong!",

            })
        } catch (error) {
            next(error);
        }

    }
    else {
        return next(appError.errHandlerCustom(403, 'You are not allow to delete this comment'));
    }
}
const editComment = async (req, res, next) => {
    const { postId } = req.params;
    const { commentId, content, updatedAt } = req.body;
    console.log(req.user.id)
    const post = await Post.findById(postId);

    const validUserEditComment = post?.comments?.find
        (comment => comment.postedBy.toString() === req.user.id && commentId === comment._id.toString());
    console.log(validUserEditComment)
    if (validUserEditComment) {
        try {
            await Post.updateOne(
                {
                    "comments._id": commentId
                },
                {
                    $set: {
                        "comments.$.content": content,
                        "comments.$.updatedAt": updatedAt,
                    }
                }, { new: true }
            )
            res.status(200).json({
                status: true,
                mes: "Updated your comment"
            })
        } catch (error) {
            next(error);
        }
    } else {
        console.log(123)
        return next(appError.errHandlerCustom(403, 'You are not allow to delete this comment'));
    }
}
export const postController = {
    createPost,
    getSingleBlog,
    getPosts,
    deletePost,
    updatePost,
    commentPost,
    deleteComment,
    editComment
}