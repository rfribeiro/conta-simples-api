import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import bcrypt from 'bcryptjs'

class AuthController {
    async authenticate(req: Request, res: Response) {
        try {
            const repository = getRepository(User)

            const { email, password } = req.body

            const user = await repository.findOne({ where: { email }})

            if (!user) {
                return res.sendStatus(400)
            }

            const isValidPassword = await bcrypt.compare(password, user.password)

            if (!isValidPassword) {
                return res.sendStatus(401)
            }

            delete user.password
            delete user.passwordResetToken
            delete user.passwordResetExpires

            return res.json({
                user,
            })
        } catch (err) {
            res.status(400).send({ error: 'Cannot authenticate user, try again' })
        }
    }

}

export default new AuthController()