import { auth } from '../config/auth.js'

export const authMiddleware = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers
        })

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized: No active session found' })
        }

        // Attach user and session to the request object for downstream use
        req.user = session.user
        req.session = session.session

        next()
    } catch (error) {
        console.error('[Auth Middleware] Error:', error)
        return res.status(500).json({ error: 'Internal server error during authentication' })
    }
}
