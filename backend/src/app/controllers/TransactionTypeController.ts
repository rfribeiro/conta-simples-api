import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import TransactionType from '../models/TransactionType';
import TransactionTypeView from '../views/transactiontype_view';

class TransactionTypeController {
    async index(req: Request, res: Response) {
        return res.send('OK');
    }

    async create(req: Request, res: Response) {
        try 
        {
            const repository = getRepository(TransactionType)

            const { type, description} = req.body

            const exists = await repository.findOne({ where: { type }})

            if (exists) {
                return res.sendStatus(409)
            }

            const typeDesc = repository.create({ type, description })
            await repository.save(typeDesc)

            return res.status(201).json(
                TransactionTypeView.render(typeDesc),
            )
        } catch (err) {
            return res.status(400).send({ error: 'Cannot register user, try again' })
        }
    }
}

export default new TransactionTypeController()