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

    const { password } = req.body;
    if (req.user.id !== id) {
        return next(appError.errHandlerCustom(403, 'You are not allowed to update this user'));
    }
    if (!req.body.username && !req.body.email) throw new Error('Missing inputs');
    if (password) {
        password = bcryptjs.hashSync(password);
    }
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                avatar: req.body.avatar,
                password
            }
        }, { new: true }).select('-password');
        res.status(200).json({
            success: updateUser ? true : false,
            result: updateUser ? updateUser : null
        });

    } catch (error) {

    }
}


export const userController = {
    test,
    updateUser
}