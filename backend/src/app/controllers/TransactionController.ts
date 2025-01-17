import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Card from '../models/Card';
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
            const { final } = req.query

            if (final && final.length !== Number(process.env.CARD_FINAL_LENGHT)) {
                return res.status(400).send({
                    error: 'Wrong card number format'
                })
            }
            let finalcard_query = "1=1"
            if (final) {
                finalcard_query = `cards.number like \'%${final}\'`
            }

            if (!enterpriseId) {
                return res.status(400).send({
                    error: 'Enteprise is not assigned to user'
                })
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
                return res.status(400).send({
                    error: 'Invalid date on query'
                })
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
                .andWhere(finalcard_query)
                .orderBy("transactions.createdAt", "DESC")
                .setParameters({ enterpriseId })
                .skip(skip)
                .take(limit)
                .cache(true)
                .getManyAndCount()

            if (!transactions) {
                return res.status(400).send({
                    error: 'Transactions not found for this enterprise'
                })
            }

            return res.send({
                page,
                limit,
                total: transactions[1],
                transactions: TransactionView.renderMany(transactions[0])
            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Cannot find transactions, try again'
            })
        }
    }

    async show(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            const { id } = req.params

            const transaction = await getRepository(Transaction)
                .createQueryBuilder("transactions")
                .innerJoinAndSelect("transactions.type", "transactionTypes")
                .innerJoinAndSelect("transactions.enterprise", "enterprises")
                .leftJoinAndSelect("transactions.card", "cards")
                .where("enterprises.id = :enterpriseId")
                .andWhere("transactions.id = :id")
                .setParameters({ enterpriseId, id })
                .cache(true)
                .getOne()

            if (!transaction) {
                return res.status(400).send({
                    error: 'Transaction not found for this enterprise'
                })
            }

            return res.send(
                TransactionView.render(transaction)
            )
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Cannot find transaction, try again'
            })
        }
    }

    async last(req: Request, res: Response) {
        try {
            const { enterpriseId } = req

            if (!enterpriseId) {
                return res.status(400).send({
                    error: 'Enteprise is not assigned to user'
                })
            }

            const transaction = await getRepository(Transaction)
                .createQueryBuilder("transactions")
                .innerJoinAndSelect("transactions.type", "transactionTypes")
                .innerJoinAndSelect("transactions.enterprise", "enterprises")
                .leftJoinAndSelect("transactions.card", "cards")
                .where("enterprises.id = :enterpriseId")
                .orderBy("transactions.createdAt", "DESC")
                .setParameters({ enterpriseId })
                .skip(0)
                .take(1)
                .cache(true)
                .getOne()

            if (!transaction) {
                return res.status(400).send({
                    error: 'Transaction not found for this enterprise'
                })
            }

            return res.send(
                TransactionView.render(transaction)
            )

        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Cannot find transaction, try again'
            })
        }
    }

    async grouped(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req

            const { final } = req.query

            if (!enterpriseId) {
                return res.status(400).send({
                    error: 'Enteprise is not assigned to user'
                })
            }

            if (final && final.length !== Number(process.env.CARD_FINAL_LENGHT)) {
                return res.status(400).send({
                    error: 'Wrong card number format'
                })
            }
            let finalcard_query = "1=1"
            if (final) {
                finalcard_query = `cards.number like \'%${final}\'`
            }

            // first find cards to be grouped

            const transactions = await getRepository(Transaction)
                .createQueryBuilder("transactions")
                .innerJoinAndSelect("transactions.type", "transactionTypes")
                .innerJoinAndSelect("transactions.enterprise", "enterprises")
                .leftJoinAndSelect("transactions.card", "cards")
                .where("enterprises.id = :enterpriseId")
                .andWhere(finalcard_query)
                .andWhere("transactions.card_id is not null")
                .orderBy("transactions.createdAt", "DESC")
                .setParameters({ enterpriseId })
                .groupBy("cards.id")
                .addGroupBy("transactions.id")
                .addGroupBy("transactionTypes.id")
                .addGroupBy("enterprises.id")
                .orderBy("cards.number")
                .cache(true)
                .getManyAndCount()

            if (!transactions) {
                return res.status(400).send({
                    error: 'Transactions not found for this enterprise'
                })
            }

            const groupedByCards = transactions[0].reduce(function (data, transaction) {
                data[transaction.card.final()] = data[transaction.card.final()] || [];
                data[transaction.card.final()].push(TransactionView.render(transaction));
                return data;
            }, Object.create(null))

            return res.send({
                groupedByCards
            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Cannot find card, try again'
            })
        }
    }

    async create(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            const { value, local, credit, finalCard, type } = req.body

            if (!enterpriseId) {
                return res.status(400).send({
                    error: 'Enterprise is not assigned for transactions'
                })
            }
            const repositoryEnterprise = getRepository(Enterprise)
            const repositoryTransaction = getRepository(Transaction)
            const repositoryType = getRepository(TransactionType)
            const repositoryCard = getRepository(Card)

            const enterpriseExists = await repositoryEnterprise
                .findOne(enterpriseId)
            if (!enterpriseExists) {
                return res.status(400).send({
                    error: 'Enterprise not found'
                })
            }

            const typeExists = await repositoryType.findOne({ where: { type }})
            if (!typeExists) {
                return res.status(400).send({
                    error: 'Transaction type not found'
                })
            }

            let card = null
            if (finalCard) {
                if (finalCard.length != process.env.CARD_FINAL_LENGHT) {
                    return res.status(400).send({
                        error: 'Card wrong format not found'
                    })
                }
                const card_query = `number like \'%${finalCard}\'`
                const cardExists = await repositoryCard
                    .createQueryBuilder("cards")
                    .where(card_query)
                    .cache(true)
                    .getOne()

                if (!cardExists) {
                    return res.status(400).send({
                        error: 'Card type not found'
                    })
                }
                card = cardExists
            }

            const transaction = await repositoryTransaction.create({
                value,
                local,
                credit,
                card,
                type: typeExists,
                enterprise: enterpriseExists
            })

            await repositoryTransaction.save(transaction)

            // update card balance
            if (card) {
                card.balance = Number(card.balance) + Number(value)
                await repositoryCard.save(card)
            }
            // update enterprise balance
            if (enterpriseExists) {
                enterpriseExists.balance = Number(enterpriseExists.balance) + Number(value)
                await repositoryEnterprise.save(enterpriseExists)
            }

            return res.status(201).json(
                TransactionView.render(transaction)
            )
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error: 'Cannot register transaction, try again'
            })
        }
    }
}

export default new TransactionController()