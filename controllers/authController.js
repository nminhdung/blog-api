import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { appError } from "../middlewares/appError.js";
import jwt from 'jsonwebtoken';

const signUp = async (req, res, next) => {
    const { email, password, username } = req.body;
    if (!username || !email || !password) {
        next(appError.errHandlerCustom(400, "All fields require"));
    }

    const existedEmail = await User.findOne({ email: email })
    if (existedEmail) throw new Error('Email existed. Please use other email!');
    const hashedPassword = bcryptjs.hashSync(password);
    const newUser = await User.create({ email, username, password: hashedPassword });
    try {
        if (newUser) {
            res.status(201).json({
                result: newUser ? newUser : null,
                mes: 'User created successfully'
            })
        }
    } catch (error) {
        next(appError.errorHandler);
    }
}

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(appError.errHandlerCustom(400, 'All fields are required'));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            next(appError.errHandlerCustom(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            next(appError.errHandlerCustom(400, 'Invalid password'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: pass, ...userData } = validUser._doc;
        res.cookie("access_token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            result: validUser ? userData : null,
            success: validUser ? true : false
        });
    } catch (error) {
        next(error);
    }
}
export const authController = {
    signUp,
    signIn
}