import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import BankAccount from '../models/BankAccount';
import Enterprise from '../models/Enterprise';
import User from '../models/User';
import EnterpriseView from '../views/enterprise_view'
import TransactionView from '../views/transaction_view'

class EnterpriseController {

    async index(req: Request, res: Response) {
        try {
            const { enterpriseId } = req

            if (!enterpriseId) {
                return res.status(400).send('Enteprise is not assigned to user')
            }

            const repositoryEnterprise = getRepository(Enterprise);

            const fullEnterprise = await repositoryEnterprise.findOneOrFail(enterpriseId, {
                relations: ['user', 'bankAccount']
            })

            return res.send(
                EnterpriseView.render(fullEnterprise)
            )
        } catch (err) {
            return res.status(400).send({ error: 'Cannot find user, try again' })
        }
    }

    async balance(req: Request, res: Response) {
        try {
            const { userId } = req

            const userRepository = getRepository(User);

            const user = await userRepository.findOneOrFail(userId, {
                relations: ['enterprise']
            })

            return res.send(
                EnterpriseView.balance(user.enterprise)
            )
        } catch (err) {
            return res.status(400).send({ error: 'Cannot find user, try again' })
        }
    }

    async transactions(req: Request, res: Response) {
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

            const user = await repositoryUser.findOneOrFail(userId, {
                relations: ['enterprise']
            })

            if (user.enterprise) {
                return res.status(400).send('User already assigned to a Enterprise')
            }

            const bankAccount = new BankAccount()
            bankAccount.bankName = "CONTA SIMPLES"
            bankAccount.bankNumber = 9999
            bankAccount.balance = 0
            bankAccount.agency = 1

            const enterprise = repositoryEnterprise.create({ name, cnpj, bankAccount, user})
            await repositoryEnterprise.save(enterprise)

            return res.status(201).json(
                EnterpriseView.render(enterprise)
            )

        } catch (err) {
            return res.status(400).send({ error: 'Cannot register user, try again' })
        }
    }
}

export default new EnterpriseController()