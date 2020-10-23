
import Transaction from "../models/Transaction"
import TransactionTypeView from './transactiontype_view'

class TransactionView {

    render(data: Transaction) {
        const { id, createdAt, value, local, credit, enterprise } = data
        const { type, description } = TransactionTypeView.render(data.type)
        return ({
            id,
            enterpriseId: enterprise.id,
            createdAt,
            value,
            type,
            description,
            local,
            credit
        })
    }

    renderMany(data: Transaction[]) {
        return data.map(type => this.render(type));
    }
}

export default new TransactionView()