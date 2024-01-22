

export const initRoutes = (app) => {
    // app.use('/api/user', userRouter)
    // app.use('/api/auth', authRouter)
    // app.use('/api/listing', listingRouter)
    app.listen(7000, () => {
        console.log('Server is running')
    })
}