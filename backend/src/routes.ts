import { Router } from 'express'

import AuthController from './app/controllers/AuthController'
import CardController from './app/controllers/CardController'
import EnterpriseController from './app/controllers/EnterpriseController'
import TransactionController from './app/controllers/TransactionController'
import TransactionTypeController from './app/controllers/TransactionTypeController'
import UserController from './app/controllers/UserController'
import AuthMiddleware from './app/middleware/AuthMiddleware'

const router = Router()

// Authentication endpoints
router.post('/login', AuthController.authenticate)
router.post('/forgot_password', AuthController.forgotPassword)
router.post('/reset_password', AuthController.resetPassword)

// User endpoints
router.post('/user', UserController.register)
router.get('/user', AuthMiddleware, UserController.index)

// Enterprise endpoints
router.post('/enterprises', AuthMiddleware, EnterpriseController.register)
router.get('/enterprises', AuthMiddleware, EnterpriseController.index)
router.get('/enterprises/balance', AuthMiddleware, EnterpriseController.balance)
router.get('/enterprises/transactions', AuthMiddleware, EnterpriseController.transactions)

// Transactions endpoints
router.post('/transactions', AuthMiddleware, TransactionController.create)
router.get('/transactions', AuthMiddleware, TransactionController.index)
router.get('/transactions/last', AuthMiddleware, TransactionController.last)
router.get('/transactions/grouped', AuthMiddleware, TransactionController.grouped)
router.get('/transactions/:id', AuthMiddleware, TransactionController.show)


// Transactions types endpoints
router.post('/transactions_types', AuthMiddleware, TransactionTypeController.create)
router.get('/transactions_types', AuthMiddleware, TransactionTypeController.index)

// Cards endpoints
router.post('/cards', AuthMiddleware, CardController.create)
router.get('/cards', AuthMiddleware, CardController.index)
router.get('/cards/:id', AuthMiddleware, CardController.show)

export default router