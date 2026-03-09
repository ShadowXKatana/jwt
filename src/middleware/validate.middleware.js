import { BadRequestError } from '../utils/errors.js'

/**
 * Middleware to validate request params, query, and body against Zod schemas.
 * 
 * @param {Object} schema - Object containing Zod schemas for body, query, and params
 * @param {import('zod').ZodSchema} [schema.body] - Schema for req.body
 * @param {import('zod').ZodSchema} [schema.query] - Schema for req.query
 * @param {import('zod').ZodSchema} [schema.params] - Schema for req.params
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.params) {
                req.params = schema.params.parse(req.params)
            }
            if (schema.query) {
                req.query = schema.query.parse(req.query)
            }
            if (schema.body) {
                req.body = schema.body.parse(req.body)
            }
            next()
        } catch (error) {
            if (error.name === 'ZodError') {
                const formattedErrors = error.errors.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }))

                return next(new BadRequestError(`Validation Failed: ${JSON.stringify(formattedErrors)}`))
            }
            next(error)
        }
    }
}
