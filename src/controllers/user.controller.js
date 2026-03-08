export class UserController {
    constructor(userService) {
        this.userService = userService
    }

    profileHandler = async (req, res) => {
        try {
            // req.user is attached by the authMiddleware from Better Auth session
            const userId = req.user.id

            const user = await this.userService.getProfile(userId)
            res.status(200).json({ user })
        } catch (error) {
            console.error('[UserController] Error:', error)
            if (error.message === 'User not found') {
                return res.status(404).json({ error: error.message })
            }
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}
