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

            let { page = 1, limit = 10,  date_begin, date_end } = req.query
            let credit = (req.query.credit === 'true')
            let debit = (req.query.debit === 'true')

            if (!enterpriseId) {
                return res.status(400).send({ error: 'Enteprise is not assigned to user' })
            }

            let dateBegin = "1=1"
            let dateEnd = "1=1"

            try {
                if (date_begin) {
                    let date_parsed = new Date(date_begin as string)
                    dateBegin = `transactions.createdAt >= \'${date_parsed.toISOString()}\'`
                }

                if (date_end) {
                    let date_parsed = new Date(date_end as string)
                    date_parsed.setUTCHours(23,59,59)
                    dateEnd = `transactions.createdAt <= \'${date_parsed.toISOString()}\'`
                }
            } catch {
                return res.status(400).send({ error: 'Invalid date on query' })
            }

            let credit_query = "1=1"

            if (credit === true && debit === false) {
                credit_query = 'credit = true'
            } else if (debit === true && credit === false) {
                credit_query = 'credit = false'
            }

            limit = (limit < 0 || limit > 50) ?  10 : Number(limit);

            page = (page < 1) ? 1 : Number(page);

            const skip = (page * limit) - limit

            const transactions = await getRepository(Transaction)
                .createQueryBuilder("transactions")
                .innerJoinAndSelect("transactions.type", "transactionTypes")
                .innerJoinAndSelect("transactions.enterprise", "enterprises")
                .leftJoinAndSelect("transactions.card", "cards")
                .where("enterprises.id = :enterpriseId")
                .andWhere(dateBegin)
                .andWhere(dateEnd)
                .andWhere(credit_query)
                .orderBy("transactions.createdAt", "DESC")
                .setParameters({ enterpriseId })
                .skip(skip)
                .take(limit)
                .cache(true)
                .getManyAndCount()

            if (!transactions) {
                return res.status(400).send({ error: 'Transactions not found for this enterprise' })
            }

            return res.send({
                page,
                limit,
                total: transactions[1],
                transactions: TransactionView.renderMany(transactions[0])
            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find transactions, try again' })
        }
    }

    async last(req: Request, res: Response) {
        try {
            const { enterpriseId } = req

            if (!enterpriseId) {
                return res.status(400).send({ error: 'Enteprise is not assigned to user'})
            }

            const transaction = await getRepository(Transaction)
                .createQueryBuilder("transactions")
                .innerJoinAndSelect("transactions.type", "transactionTypes")
                .innerJoinAndSelect("transactions.enterprise", "enterprises")
                .where("enterprises.id = :enterpriseId")
                .orderBy("transactions.createdAt", "DESC")
                .setParameters({ enterpriseId })
                .skip(0)
                .take(1)
                .cache(true)
                .getOne()

            if (!transaction) {
                return res.status(400).send({ error: 'Transactions not found for this enterprise' })
            }

            return res.send(
                TransactionView.render(transaction)
            )

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find transaction, try again' })
        }
    }

    async create(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            const { value, local, credit, finalCard, type } = req.body

            if (!enterpriseId) {
                return res.status(400).send({ error: 'Enterprise is not assigned for transactions' })
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