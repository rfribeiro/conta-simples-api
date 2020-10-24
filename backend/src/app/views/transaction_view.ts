
import Transaction from "../models/Transaction"
import TransactionTypeView from './transactiontype_view'
import CardView from './card_view'

interface TransactionViewResponseData {
    id: string,
    enterpriseId: string,
    createdAt: Date;
    value: number;
    type: string,
    description: string
    local: string;
    credit: boolean;
    finalCard?: string;
}

class TransactionView {

    render(data: Transaction) {
        const { id, createdAt, value, local, credit, enterprise, card } = data
        const { type, description } = TransactionTypeView.render(data.type)

        let trView = {
            id,
            enterpriseId: enterprise.id,
            createdAt,
            value,
            type,
            description,
            local,
            credit,
        } as TransactionViewResponseData

        if (card) {
            trView["finalCard"] = CardView.final(card)
        }

        return trView
    }

    renderMany(data: Transaction[]) {
        return data.map(type => this.render(type));
    }
}

export default new TransactionView()