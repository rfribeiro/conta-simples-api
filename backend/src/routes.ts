import { Router } from 'express'

import AuthController from './app/controllers/AuthController'
import EnterpriseController from './app/controllers/EnterpriseController'
import UserController from './app/controllers/UserController'

const router = Router()

// Authentication endpoints
router.post('/login', AuthController.authenticate)

// User endpoints
router.post('/users', UserController.register)

// Enterprise endpoints
router.post('/enterprises', EnterpriseController.register)

export default router