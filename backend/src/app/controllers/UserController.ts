import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import TokenHelper from '../utils/TokenHelper';
import UserView from '../views/user_view'

class UserController {
    async index(req: Request, res: Response) {
        try
        {
            const repository = getRepository(User)

            const userExists = await repository.findOneOrFail(req.userId)
            if (!userExists) {
                return res.sendStatus(409)
            }

            return res.status(201).json({
                user: UserView.render(userExists)
            })
        } catch (err) {
            return res.status(400).send({ error: 'Cannot find user, try again' })
        }
    }

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

            return res.status(201).json({
                user: UserView.render(user),
                token : TokenHelper.generate({id: user.id})
            })
        } catch (err) {
            return res.status(400).send({ error: 'Cannot register user, try again' })
        }
    }
}

export default new UserController()