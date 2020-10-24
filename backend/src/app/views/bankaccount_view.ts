
import BankAccount from "../models/BankAccount"

class BankAccountView {

    render(data: BankAccount) {
        const { bankNumber, bankName, agency, id, digit, createdAt } = data
        return ({
            bankNumber,
            bankName,
            agency,
            account: id,
            digit,
            createdAt,
        })
    }
}

export default new BankAccountView()