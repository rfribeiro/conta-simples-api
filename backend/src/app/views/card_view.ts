
import Card from "../models/Card"

class CardView {

    final(data: Card) {
        return data.final()
    }

    render(data: Card) {
        const { id, balance } = data
        return ({
            id,
            final: data.final(),
            balance,
        })
    }

    renderMany(data: Card[]) {
        return data.map(card => this.render(card));
    }
}

export default new CardView()