import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
    }
}, { timestamps: true });

//Export the model
const User = mongoose.model("User", userSchema);
export default User;