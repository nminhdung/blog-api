import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://media.sproutsocial.com/uploads/2019/09/how-to-write-a-blog-post.svg'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    comments: [
        {
            postedBy: {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
            content: { type: String },
            updatedAt: { type: Date }
        },

    ],
}, { timestamps: true });

//Export the model
const Post = mongoose.model("post", postSchema);
export default Post;