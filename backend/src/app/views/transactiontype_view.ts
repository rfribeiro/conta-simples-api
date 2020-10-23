
import TransactionType from "../models/TransactionType"

class TransactionTypeView {

    render(data: TransactionType) {
        const { type, description } = data
        return ({
            type,
            description,
        })
    }

    renderMany(data: TransactionType[]) {
        return data.map(type => this.render(type));
    }
}

export default new TransactionTypeView()