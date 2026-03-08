import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' })
})

router.get('/help', (req, res) => {
    res.status(200).json({
        message: 'Available API Routes',
        routes: {
            'GET /api': {
                description: 'Health check route to verify the server is running.',
                params: 'None',
                auth_required: false
            },
            'GET /api/help': {
                description: 'This help endpoint detailing all available routes.',
                params: 'None',
                auth_required: false
            },
            'POST /api/auth/sign-up': {
                description: 'Register a new user via Better Auth.',
                params: {
                    email: 'string (required)',
                    password: 'string (required)',
                    name: 'string (required)'
                },
                auth_required: false
            },
            'POST /api/auth/sign-in': {
                description: 'Log in an existing user via Better Auth.',
                params: {
                    email: 'string (required)',
                    password: 'string (required)'
                },
                auth_required: false
            },
            'GET /api/user/profile': {
                description: 'Fetch custom profile data from the database.',
                params: 'None',
                auth_required: true,
                headers: 'Authorization: Bearer <token>'
            }
        }
    })
})

export default router