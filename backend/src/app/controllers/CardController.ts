import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Card from '../models/Card';
import Enterprise from '../models/Enterprise';
import CardView from '../views/card_view';
import TransactionView from '../views/transaction_view'

class CardController {
    async index(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            let { page = 1, limit = 10 } = req.query
            const { final } = req.query

            if (final && final.length !== Number(process.env.CARD_FINAL_LENGHT)) {
                return res.status(400).send({
                    error: 'Wrong card number format'
                })
            }

            let card_query = "1=1"
            if (final) {
                card_query = `number like \'%${final}\'`
            }

            limit = (limit < 0 || limit > 50) ?  10 : Number(limit);
            page = (page < 1) ? 1 : Number(page);
            const skip = (page * limit) - limit

            const cards = await getRepository(Card)
                .createQueryBuilder("cards")
                .innerJoinAndSelect("cards.enterprise", "enterprises")
                .where("enterprises.id = :enterpriseId")
                .andWhere(card_query)
                .setParameters({ enterpriseId })
                .skip(skip)
                .take(limit)
                .cache(true)
                .getManyAndCount()

            if (!cards) {
                return res.sendStatus(409)
            }

            return res.status(200).json( {
                page,
                limit,
                total: cards[1],
                cards: CardView.renderMany(cards[0])
            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find card, try again' })
        }
    }

    async show(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            const { id } = req.params

            const card = await getRepository(Card)
                .createQueryBuilder("cards")
                .innerJoinAndSelect("cards.enterprise", "enterprises")
                .where("enterprises.id = :enterpriseId")
                .andWhere("cards.id = :id")
                .setParameters({ enterpriseId, id })
                .cache(true)
                .getOne()

            if (!card) {
                return res.status(400).send({ error: 'Card not found for this enterprise' })
            }

            return res.send(
                CardView.render(card)
            )

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find card, try again' })
        }
    }

    async create(req: Request, res: Response) {
        try 
        {           
            const { enterpriseId } = req
            const { number } = req.body

            const repository = getRepository(Card)
            const repositoryEnterprise = getRepository(Enterprise)

            const exists = await repository.findOne({ where: { number }})

            if (exists) {
                return res.sendStatus(409)
            }

            const enterpriseExists = await repositoryEnterprise.findOne(enterpriseId)
            if (!enterpriseExists) {
                return res.status(400).send({ error: 'Enterprise not found' })
            }

            const card = repository.create({ number })
            card.enterprise = enterpriseExists
            await repository.save(card)

            return res.status(201).json(
                CardView.render(card),
            )
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot register card, try again' })
        }
    }
}

export default new CardController()