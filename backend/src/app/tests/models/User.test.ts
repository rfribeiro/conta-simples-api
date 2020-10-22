import * as chai from 'chai';
import { expect, assert } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { getRepository, QueryFailedError } from 'typeorm';
import User from '../../models/User';
import { createConnection } from 'typeorm'
import bcrypt from 'bcryptjs';
chai.use(chaiAsPromised)

const user_data = {
    email: "teste@contasimples.com.br",
    mobile: "111111111",
    password: "11234"
}

describe("User model", () => {
    before(async () => {
       await createConnection()
       console.log('📦 Successfully connected to database')
    })
    it('Create User', async () => {
        const repository = getRepository(User)

        const { email, mobile, password } = user_data

        const user = repository.create({ email, mobile, password })
        await repository.save(user)

        const userExists = await repository.findOne({ where: { email }})

        assert.exists(user, 'User not registered on DB')
        assert.equal(user.id, userExists.id, 'User Id mismatch')
        assert.equal(user.email, userExists.email, 'User email mismatch')
        assert.equal(user.mobile, userExists.mobile, 'User mobile mismatch')
        assert.deepEqual(user.createdAt, userExists.createdAt, 'User createdAt mismatch')
        assert.isNull(user.passwordResetToken, 'User passwordResetToken is not null')
        assert.isNull(user.passwordResetExpires, 'User passwordResetExpires is not null')
        assert.equal(user.password, userExists.password, 'Password mismatch')

        assert.equal(email, userExists.email, 'User email mismatch')
        assert.equal(mobile, userExists.mobile, 'User mobile mismatch')
        const isValidPasswordData = await bcrypt.compare(password, user.password)
        console.log(isValidPasswordData)
        assert.equal(isValidPasswordData, true, 'Password mismatch')
    })
    it('Check Duplicate User', async () => {
        const repository = getRepository(User)

        const { email, mobile, password } = user_data

        const user = repository.create({ email, mobile, password })

        await chai.expect(repository.save(user)).to.be.rejected
    })
    it('Delete User', async () => {
        const repository = getRepository(User)

        const { email, mobile, password } = user_data

        const userExists = await repository.findOne({ where: { email }})

        const removedUser = await repository.remove(userExists)

        assert.exists(removedUser, 'User not found')
        assert.equal(userExists, removedUser, 'User not same')
    })
})