import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionType from '../models/TransactionType';
import TransactionView from '../views/transactions_view';

class TransactionController {
    async index(req: Request, res: Response) {
        return res.send('OK');
    }

    async create(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            const { value, local, credit, finalCard, type } = req.body

            if (!enterpriseId) {
                return res.status(400).send('Enterprise is not assigned for transactions')
            }
            const repository = getRepository(Transaction)
            const repositoryType = getRepository(TransactionType)

            const typeExists = await repositoryType.findOneOrFail({ where: { type }})
            if (!typeExists) {
                return res.sendStatus(409)
            }

            const transaction = repository.create({
                value,
                local,
                credit,
                type: typeExists
            })

            await repository.save(transaction)

            return res.status(201).json(
                TransactionView.render(transaction)
            )
        } catch (err) {
            return res.status(400).send({ error: 'Cannot register transaction type, try again' })
        }
    }
}

export default new TransactionController()