
import Card from "../models/Card"

class CardView {

    render(data: Card) {
        const { id, number } = data
        return ({
            id,
            final: number.substr(number.length - 4),
        })
    }

    renderMany(data: Card[]) {
        return data.map(card => this.render(card));
    }
}

export default new CardView()