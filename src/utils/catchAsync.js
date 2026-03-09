/**
 * Wraps async functions to catch errors and pass them to Express next()
 * Eliminates the need for try/catch blocks in controllers
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
