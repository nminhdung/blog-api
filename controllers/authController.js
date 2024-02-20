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
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
const Google = async (req, res, next) => {
    const { email, name, photoURL } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = await User.create({
                username: name.toLowerCase().split(' ').join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                avatar: photoURL
            })
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password: pass, ...dataUser } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            }).json(dataUser)
        }
    } catch (error) {
        next(error);
    }
}
const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    } catch (error) {
        next(error);
    }
}
export const authController = {
    signUp,
    signIn,
    Google,
    signOut
}