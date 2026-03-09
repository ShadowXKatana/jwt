import { Router } from 'express'
import container from '../container.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

// Resolve the controller from the Awilix container
const userController = container.cradle.userController

// Protected route (requires valid Better Auth session)
router.get('/profile', authMiddleware, userController.profileHandler)

export default router
