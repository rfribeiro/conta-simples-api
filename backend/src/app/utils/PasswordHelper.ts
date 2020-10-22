require('dotenv/config')
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

class PasswordHelper {

    hash(password: string) {
        return bcrypt.hashSync(password, parseInt(process.env.PASSWORD_SALT))
    }

    verify(password: string, hash: string) {
        return bcrypt.compareSync(password, hash)
    }
}

export default new PasswordHelper()