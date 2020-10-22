interface UserViewData {
    email: string;
    mobile: string;
    id: string;
    createdAt: Date;
}

class UserView {

    render(data: UserViewData) {
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