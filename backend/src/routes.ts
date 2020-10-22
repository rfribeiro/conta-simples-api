import { Router } from 'express'

import AuthController from './app/controllers/AuthController'
import EnterpriseController from './app/controllers/EnterpriseController'
import UserController from './app/controllers/UserController'
import AuthMiddleware from './app/middleware/AuthMiddleware'

const router = Router()

// Authentication endpoints
router.post('/login', AuthController.authenticate)
router.post('/forgot_password', AuthController.forgotPassword)
router.post('/reset_password', AuthController.resetPassword)

// User endpoints
router.post('/users', UserController.register)
router.get('/users', AuthMiddleware, UserController.index)

// Enterprise endpoints
router.post('/enterprises', AuthMiddleware, EnterpriseController.register)
router.get('/enterprises', AuthMiddleware, EnterpriseController.index)
router.get('/enterprises/balance', AuthMiddleware, EnterpriseController.balance)

export default router