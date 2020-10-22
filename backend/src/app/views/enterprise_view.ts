import Enterprise from "../models/Enterprise"
import UserView from './user_view'
import BankAccountView from './bankaccount_view'

class EnterpriseView {

    render(data: Enterprise) {
        const { id, name, cnpj, balance, createdAt, user, bankAccount } = data
        return ({
            id,
            name,
            cnpj,
            createdAt,
            balance,
            bankAccount: BankAccountView.render(bankAccount),
            user: UserView.render(user),
        })
    }

    balance(data: Enterprise) {
        const { id, name, cnpj, balance, createdAt } = data
        return ({
            id,
            name,
            cnpj,
            createdAt,
            balance,
        })
    }
}

export default new EnterpriseView()