import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Enterprise from '../models/Enterprise';
import Transaction from '../models/Transaction';
import TransactionType from '../models/TransactionType';
import TransactionView from '../views/transaction_view';

class TransactionController {
    async index(req: Request, res: Response) {
        try {
            const { enterpriseId } = req

            if (!enterpriseId) {
                return res.status(400).send('Enteprise is not assigned to user')
            }

            const repository = getRepository(Enterprise);

            const enterprise = await repository.findOne(enterpriseId, {
                relations: ['transactions', 'transactions.enterprise', 'transactions.type']
            })

            return res.send(
                TransactionView.renderMany(enterprise.transactions)
            )

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find user, try again' })
        }
    }

    async last(req: Request, res: Response) {
        try {
            const { enterpriseId } = req

            if (!enterpriseId) {
                return res.status(400).send('Enteprise is not assigned to user')
            }

            const repository = getRepository(Transaction);

            const enterprise = await repository.find({
                //where: { enterprise : enterpriseId},
                order: {
                    createdAt: 'DESC'
                },
                take: 1,
                relations: ['enterprise', 'type']
            })

            console.log(enterprise)
            return res.send(
                TransactionView.renderMany(enterprise)
            )

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find user, try again' })
        }
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