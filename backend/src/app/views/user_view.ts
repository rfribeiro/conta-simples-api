import User from "../models/User"

class UserView {

    render(data: User) {
        const { id, email, mobile, createdAt } = data
        return ({
            id,
            email,
            mobile,
            createdAt,
        })
    }
}

export default new UserView()