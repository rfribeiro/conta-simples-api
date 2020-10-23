
import TransactionType from "../models/TransactionType"

class TransactionTypeView {

    render(data: TransactionType) {
        const { type, description } = data
        return ({
            type,
            description,
        })
    }
}

export default new TransactionTypeView()