import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import BankAccount from '../models/BankAccount';
import Enterprise from '../models/Enterprise';
import User from '../models/User';


class EnterpriseController {

    async index(req: Request, res: Response) {
        const { userId } = req

    }

    async show(req: Request, res: Response) {
        const { userId } = req
        const { id } = req.params;

        const enterpriseRepository = getRepository(Enterprise);

        const enterprise = await enterpriseRepository.findOneOrFail(id, {
            relations: ['bank']
        })

        return res.send(enterprise)
    }

    async register(req: Request, res: Response) {
        try 
        {
            const { userId } = req
            const { name, cnpj } = req.body

            const repositoryEnterprise = getRepository(Enterprise);
            const repositoryUser = getRepository(User);

            const enterpriseExists = await repositoryEnterprise.findOne({ where: { cnpj }})

            if (enterpriseExists) {
                return res.sendStatus(409)
            }

            const user = await repositoryUser.findOneOrFail(userId)

            const bankAccount = new BankAccount()
            bankAccount.bankName = "CONTA SIMPLES"
            bankAccount.bankNumber = 9999
            bankAccount.balance = 0
            bankAccount.agency = 1

            const enterprise = repositoryEnterprise.create({ name, cnpj, bankAccount, user})
            await repositoryEnterprise.save(enterprise)

            return res.status(201).json({
                enterprise
            })

        } catch (err) {
            console.log(err)
            return res.status(400).send({ error: 'Cannot register user, try again' })
        }
    }
}

export default new EnterpriseController()