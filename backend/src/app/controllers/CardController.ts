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

    async create(req: Request, res: Response) {
        try 
        {           
            const { enterpriseId } = req
            const { number } = req.body

            console.log(number, enterpriseId)

            const repository = getRepository(Card)
            const repositoryEnterprise = getRepository(Enterprise)

            const exists = await repository.findOne({ where: { number }})

            console.log(exists)
            if (exists) {
                return res.sendStatus(409)
            }

            const enterpriseExists = await repositoryEnterprise.findOne(enterpriseId)
            if (!enterpriseExists) {
                return res.status(400).send({ error: 'Enterprise not found' })
            }
            console.log(enterpriseExists)

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