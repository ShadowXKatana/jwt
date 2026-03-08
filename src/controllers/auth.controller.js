export class AuthController {
    constructor(authService) {
        this.authService = authService
    }

    registerHandler = async (req, res) => {
        try {
            const { email, password, name } = req.body

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' })
            }

            const user = await this.authService.register(email, password, name)
            res.status(201).json({ message: 'User registered successfully', user })
        } catch (error) {
            if (error.message === 'Email already in use') {
                return res.status(409).json({ error: error.message })
            }
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    loginHandler = async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' })
            }

            const result = await this.authService.login(email, password)
            res.status(200).json({ message: 'Login successful', ...result })
        } catch (error) {
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({ error: error.message })
            }
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    profileHandler = async (req, res) => {
        try {
            // req.user is attached by the authMiddleware
            const userId = req.user.userId

            const user = await this.authService.getProfile(userId)
            res.status(200).json({ user })
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message })
            }
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}
