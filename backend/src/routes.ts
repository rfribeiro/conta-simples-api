import { Router } from 'express'

import AuthController from './controllers/AuthController'
import EnterpriseController from './controllers/EnterpriseController'
import UserController from './controllers/UserController'

const router = Router()

// Authentication endpoints
router.post('/login', AuthController.authenticate)

// User endpoints
router.post('/users/register', UserController.register)

// Enterprise endpoints
router.post('/enterprises/register', EnterpriseController.register)

export default router