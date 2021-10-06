// login
// veritoken
// register
// generatetoken

require('dotenv').config()
const bcrypt = require('bcrypt')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const username = 'test_user'
const password = 'test_password'
const email = 'test_email@gmail.com'

const { getMockReq, getMockRes } = require('@jest-mock/express')

const db = {
    findUserByUsernameEmail: jest.fn( async () => {
        return {
            id: 1,
            username,
            email,
            password_hash: await bcrypt.hash(password, SALT_ROUNDS)
        }
    }),
    insertUser: jest.fn( async () => {
        return {
            id:1
        }
    })
}

const authService = require('./auth.js')(db)

describe('Register User', () => {
    describe('given a username, password and email', () => {
        it('should return a token', async () => {
            db.findUserByUsernameEmail.mockResolvedValueOnce(null)
            const token  = await authService.registerUser(username, password, email)
            expect(token).toBeTruthy()
        })
    })
    describe('given an existing username and password', () => {
        it('should return null', async () => {
            const token  = await authService.registerUser(username, password, email)
            expect(token).toBeFalsy()
        })
    })
})

describe('Login User', () => {
    describe('given valid username, password and email', () => {
        it('should return a token', async () => {
            const token = await authService.loginUser(username, password)
            expect(token).toBeTruthy()
        })
    })

    describe('given invalid password', () => {
        it('should return null', async () => {
            const token = await authService.loginUser(username, 'wrongpassword')
            expect(token).toBeFalsy()
        })
    })

    describe('given invalid username', () => {
        it('should return null', async () => {
            db.findUserByUsernameEmail.mockResolvedValueOnce(null)
            const token = await authService.loginUser('wrongusername', password)
            expect(token).toBeFalsy()
        })
    })
})

describe('verify Token', () => {
    describe('valid token', () =>{
        it('should return uid', async () => {
            const uid = 2
            const token = authService.generateToken(uid)
            const verify = await authService.verifyToken(token)
            expect(verify).toEqual(uid)
        })
    })

    describe('invalid token', () => {
        it('should return null', async () => {
            const token = 'faketoken'
            const verify = await authService.verifyToken(token)
            expect(verify).toBeFalsy()
        })
    })
})


