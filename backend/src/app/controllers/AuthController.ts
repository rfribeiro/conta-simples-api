import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import TokenHelper from '../utils/TokenHelper';
import Mail from '../services/Mailer';
import PasswordHelper from '../utils/PasswordHelper';
import UserView from '../views/user_view';

const mailConfig = require('../config/mail.json');

class AuthController {
    async authenticate(req: Request, res: Response) {
        try {
            const repository = getRepository(User)

            const { email, password } = req.body

            const user = await repository.findOne({ 
                where: { email },
                relations: ['enterprise']
            })

            if (!user) {
                return res.sendStatus(400)
            }

            const isValidPassword = PasswordHelper.verify(password, user.password)

            if (!isValidPassword) {
                return res.sendStatus(401)
            }

            return res.json({
                user: UserView.render(user),
                token : TokenHelper.generate({
                    userId: user.id, 
                    enterpriseId: user.enterprise ? user.enterprise.id : undefined
                })
            })
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Cannot authenticate user, try again'
            })
        }
    }

    async forgotPassword(req: Request, res: Response) {

        try {
            const { email } = req.body

            const repository = getRepository(User)

            const user = await repository.findOne({ where: { email }})

            if (!user) {
                return res.sendStatus(400)
            }

            const now = new Date()
            now.setHours(now.getHours() + 1)

            const token = TokenHelper.generateReset()

            await repository.update(user.id, {
                passwordResetToken: token,
                passwordResetExpires: now
            })

            await Mail.send({
                to: user.email,
                from: mailConfig.to,
                html: mailConfig.template,
                subject: mailConfig.subject,
                context: { token }
            })
            return res.send({
                user: UserView.render(user),
                message: 'Email sent with success'
            })
        } catch (err) {
            console.log('Errors occurred, failed to deliver message');
            if (err.response && err.response.body && err.response.body.errors) {
                err.response.body.errors.forEach((error: any) => console.log('%s: %s', error.field, error.message));
            } else {
                console.log(err);
            }
            res.status(400).send({
                error: 'Cannot send reset email, try again'
            })
        }
    }

    async resetPassword(req: Request, res: Response) {

        try {
            const { email, token, password } = req.body

            const repository = getRepository(User)

            const user = await repository.findOne({ where: { email }})

            if (!user) {
                return res.status(400).send({ error: 'Invalid email' })
            }

            if (token !== user.passwordResetToken) {
                return res.status(400).send({ error: 'Invalid token' })
            }

            if (new Date() > user.passwordResetExpires) {
                return res.status(400).send({ error: 'Expired token' })
            }

            user.password = password
            user.hashPassword()
            user.passwordResetToken = ''

            await repository.save(user)

            return res.send({
                user: UserView.render(user),
                message: 'password reset with success'
            })
        } catch (err) {
            res.status(400).send({
                error: 'Cannot reset password, try again'
            })
        }
    }
}

export default new AuthController()