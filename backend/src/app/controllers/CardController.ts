import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Card from '../models/Card';
import Enterprise from '../models/Enterprise';
import CardView from '../views/card_view';

class CardController {
    async index(req: Request, res: Response) {
        try
        {
            const repository = getRepository(Card)

            const exists = await repository.find()
            if (!exists) {
                return res.sendStatus(409)
            }

            return res.status(201).json(
                CardView.renderMany(exists)
            )
        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot find card, try again' })
        }
    }

    async show(req: Request, res: Response) {
        try
        {
            const { enterpriseId } = req
            const { final } = req.params

            const card_query = `number like \'%${final}\'`

            const card = await getRepository(Card)
                .createQueryBuilder("cards")
                .innerJoinAndSelect("cards.enterprise", "enterprises")
                .where("enterprises.id = :enterpriseId")
                .andWhere(card_query)
                .setParameters({ enterpriseId })
                .cache(true)
                .getOne()

            if (!card) {
                return res.status(400).send({ error: 'Transactions not found for this enterprise' })
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