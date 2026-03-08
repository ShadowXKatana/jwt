import { Router } from 'express'
import prisma from '../config/database.js'
import { UserRepository } from '../repositories/user.repository.js'
import { UserService } from '../services/user.service.js'
import { UserController } from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

// 1. Instantiate the Repository with Prisma connection
const userRepository = new UserRepository(prisma)

// 2. Instantiate the Service with the Repository
const userService = new UserService(userRepository)

// 3. Instantiate the Controller with the Service
const userController = new UserController(userService)

// 4. Set up routes
const router = Router()

// Protected route (requires valid Better Auth session)
router.get('/profile', authMiddleware, userController.profileHandler)

export default router
