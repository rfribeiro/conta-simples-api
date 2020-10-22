
import BankAccount from "../models/BankAccount"

class BankAccountView {

    render(data: BankAccount) {
        const { bankNumber, bankName, agency, id, digit } = data
        return ({
            bankNumber,
            bankName,
            agency,
            account: id,
            digit
        })
    }
}

export default new BankAccountView()