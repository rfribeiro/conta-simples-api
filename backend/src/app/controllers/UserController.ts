import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';

class UserController {

    async register(req: Request, res: Response) {
        try 
        {
            const repository = getRepository(User)

            const { email, mobile, password } = req.body

            const userExists = await repository.findOne({ where: { email }})

            if (userExists) {
                return res.sendStatus(409)
            }

            const user = repository.create({ email, mobile, password })
            await repository.save(user)

            delete user.password
            delete user.passwordResetToken
            delete user.passwordResetExpires

            return res.status(201).json({
                user,
            })
        } catch (err) {
            console.log(err, err.message)
            res.status(400).send({ error: 'Cannot register user, try again' })
        }
    }
}

export default new UserController()