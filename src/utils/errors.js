/**
 * Base error class for all operational errors
 */
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true // Identifies programmatic errors vs unexpected bugs

        Error.captureStackTrace(this, this.constructor)
    }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400)
    }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404)
    }
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409)
    }
}
