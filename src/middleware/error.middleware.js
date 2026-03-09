import { AppError } from '../utils/errors.js'

/**
 * Global Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else {
        let error = { ...err, message: err.message }

        // Prisma Record Not Found Error
        if (err.code === 'P2025') {
            error = new AppError('Record not found', 404)
        }

        // Prisma Unique Constraint Error
        if (err.code === 'P2002') {
            const target = err.meta?.target || 'field'
            error = new AppError(`Duplicate field value: ${target}. Please use another value!`, 400)
        }

        // Token Error
        if (err.name === 'JsonWebTokenError') {
            error = new AppError('Invalid token. Please log in again!', 401)
        }

        // Token Expired
        if (err.name === 'TokenExpiredError') {
            error = new AppError('Your token has expired! Please log in again.', 401)
        }

        sendErrorProd(error, res)
    }
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    // Programming or other unknown error: don't leak error details
    else {
        // 1) Log error
        console.error('ERROR 💥', err)

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        })
    }
}
