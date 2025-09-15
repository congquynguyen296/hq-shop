import express from 'express'
import { register, login, getProfile, logout } from '../controllers/auth.controller'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticateToken, logout)

// Protected routes
router.get('/profile', authenticateToken, getProfile)

export default router
