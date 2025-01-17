import { Request, Response, NextFunction } from "express";
import TokenHelper from '../utils/TokenHelper'

export default function AuthMiddleware(
    req: Request, res: Response, next: NextFunction,
) {
    const { authorization } = req.headers

    if (!authorization) {
        return res.sendStatus(401)
    }

    if (authorization.split(' ').length < 2) {
        return res.sendStatus(401)
    }

    const token = authorization.replace('Bearer', '').trim()

    try {
        const data = TokenHelper.verify(token)

        const { userId, enterpriseId } = data

        req.userId = userId
        req.enterpriseId = enterpriseId

        next() 
    } catch {
        return res.sendStatus(401)
    }
}