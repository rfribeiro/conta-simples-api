import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import TokenHelper from '../utils/TokenHelper';

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
                token : TokenHelper.generate({id: user.id})
            })
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot register user, try again' })
        }
    }
}

export default new UserController()