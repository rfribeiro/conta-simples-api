import Enterprise from "../models/Enterprise"
import UserView from './user_view'
import BankAccountView from './bankaccount_view'
import CardView from './card_view'

class EnterpriseView {

    render(data: Enterprise) {
        const { id, name, cnpj, balance, createdAt, user, bankAccount, cards } = data
        return ({
            id,
            name,
            cnpj,
            createdAt,
            balance,
            bankAccount: (bankAccount) ? BankAccountView.render(bankAccount) : null,
            cards: (cards) ? CardView.renderMany(cards) : null,
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