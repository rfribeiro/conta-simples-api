import { Router } from 'express'

import AuthController from './controllers/AuthController'
import EnterpriseController from './controllers/EnterpriseController'

const router = Router()

// Authentication endpoints
router.post('/login', AuthController.authenticate)

// Enterprise endpoints
router.post('/register', EnterpriseController.register)

export default router