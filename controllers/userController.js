import bcryptjs from 'bcryptjs';
import User from '../models/user.js';


const test = (req, res) => {
    res.json({
        message: 'Hello World'
    })
}



export const userController = {
    test,
    
}