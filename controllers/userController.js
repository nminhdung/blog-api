import bcryptjs from 'bcryptjs';
import { appError } from '../middlewares/appError.js';
import User from '../models/user.js';


const test = (req, res) => {
    res.json({
        message: 'Hello World'
    })
}
const updateUser = async (req, res) => {
    const { id } = req.params;


    if (req.user.id !== id) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to update this user'));
    }
    if (!req.body.username && !req.body.email) throw new Error('Missing inputs');
    if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                avatar: req.body.avatar,
                password: req.body.password
            }
        }, { new: true }).select('-password');
        res.status(200).json({
            success: updateUser ? true : false,
            result: updateUser ? updateUser : null
        });

    } catch (error) {

    }
}

const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to access all users'));
    }
    try {
        const start = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || process.env.LIMIT;
        const sortDir = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find().sort({ createdAt: sortDir }).skip(start).limit(limit);
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: users ? true : false,
            totalUsers,
            result: users ? users : []
        });
    } catch (error) {
        next(error)
    }

}

const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to delete this post '));
    }
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: deletedUser ? true : false,
            mes: deletedUser ? "Deleted successfully" : "Failed"
        })
    } catch (error) {
        next(appError.errHandlerCustom(403, 'Something went wrong!!'))
    }
}
export const userController = {
    getUsers,
    updateUser,
    deleteUser
}