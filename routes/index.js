import { userRouter } from "./user.js"
import { authRouter } from "./auth.js"
import { appError } from "../middlewares/appError.js"
import { postRouter } from "./post.js"


export const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/post', postRouter)
   

    app.use(appError.errorHandler)
    
}