import { Router } from 'express'
import { auth } from '../config/auth.js'
import { toNodeHandler } from 'better-auth/node'

const router = Router()

// Handle all /api/auth/* requests with Better Auth
router.use(toNodeHandler(auth))

export default router
