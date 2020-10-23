import { Request, Response } from 'express';


class TransactionTypeController {
    async index(req: Request, res: Response) {
        return res.send('OK');
    }

    async create(req: Request, res: Response) {
        return res.send('OK');
    }
}

export default new TransactionTypeController()