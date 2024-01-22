 const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
}
 const errHandlerCustom = (status, message) => {
    const error = new Error();
    error.statusCode = status;
    error.message = message;
    return error
}

export const appError = {
    errorHandler,
    errHandlerCustom
}