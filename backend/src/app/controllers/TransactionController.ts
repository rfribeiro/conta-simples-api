import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Enterprise from '../models/Enterprise';
import Transaction from '../models/Transaction';
import TransactionType from '../models/TransactionType';
import TransactionView from '../views/transaction_view';

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
            const repositoryEnterprise = getRepository(Enterprise)
            const repositoryTransaction = getRepository(Transaction)
            const repositoryType = getRepository(TransactionType)

            const enterpriseExists = await repositoryEnterprise.findOne(enterpriseId)
            if (!enterpriseExists) {
                return res.status(400).send({ error: 'Enterprise not found' })
            }

            const typeExists = await repositoryType.findOne({ where: { type }})
            if (!typeExists) {
                return res.status(400).send({ error: 'Transaction type not found' })
            }

            const transaction = repositoryTransaction.create({
                value,
                local,
                credit,
                type: typeExists,
                enterprise: enterpriseExists
            })

            await repositoryTransaction.save(transaction)

            return res.status(201).json(
                TransactionView.render(transaction)
            )
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot register transaction, try again' })
        }
    }
}

export default new TransactionController()