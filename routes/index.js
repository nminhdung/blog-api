import { userRouter } from "./user.js"
import { authRouter } from "./auth.js"
import { appError } from "../middlewares/appError.js"


export const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/auth', authRouter)
    // app.use('/api/auth', authRouter)
    // app.use('/api/listing', listingRouter)

    app.use(appError.errorHandler)
    
}