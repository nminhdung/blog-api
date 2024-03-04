import jwt from 'jsonwebtoken';
import { appError } from './appError.js';

export const verifyToken = (req, res, next) => {
    // const token = req.cookies.access_token;
    // if (!token) {
    //     return next(appError.errHandlerCustom(401, 'Unauthorized'));
    // }

    //header :{authorization: Bearer token}
    if (req?.header?.authorization?.startsWith("Bearer")) {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(appError.errHandlerCustom(401, 'Unauthorized'));
            }
            req.user = user;
            next();
        })
    }

};