import { Request, Response } from 'express';

class AuthController {
    async authenticate(req: Request, res: Response) {
        try {
            return res.send('OK')
        } catch (err) {
            res.status(400).send({ error: 'Cannot authenticate user, try again' })
        }
    }

}

export default new AuthController()