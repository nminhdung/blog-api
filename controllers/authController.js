import User from '../models/user.js';
import bcryptjs from 'bcryptjs';
import { appError } from "../middlewares/appError.js"


const signUp = async (req, res, next) => {
    const { email, password, username } = req.body
    if (!username || !email || !password) {
        next(appError.errHandlerCustom(400,"All fields require"))
    }

    const existedEmail = await User.findOne({ email: email })
    if (existedEmail) throw new Error('Email existed. Please use other email!')
    const hashedPassword = bcryptjs.hashSync(password)
    const newUser = await User.create({ email, username, password: hashedPassword })
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


export const authController = {
    signUp
}