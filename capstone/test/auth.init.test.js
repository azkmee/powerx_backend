const request = require('supertest')
const utils = require('./utils')

const app = utils.app
const db = utils.db

const username = 'test_username'
const password = 'test_password'
const email = 'test_email@hotmail.com'


beforeAll(async () => {
    await utils.setup()
})

afterAll(async () => {
    await utils.teardown()
})


describe('POST /register', () => {
    beforeAll(async () => {
        await db.clearUserAccessTable()
        await db.clearUserTable()
    })

    it('should return with a token', async () => {
        return  request(app)
            .post('/register')
            .send({ username, password, email })
            .expect(200)
            .then( res => {
                expect(res.body.token).toBeTruthy()
            })
    })

    it('should return 400 if user exists', async () => {
        return request(app)
            .post('/register')
            .send({username, password, email:'diff'})
            .expect(400)
            .then( res => {
                expect(res.body.token).toBeFalsy()
            })
    })

    it('should return 400 if email exists', async () => {
        return request(app)
            .post('/register')
            .send({username:'user', password, email})
            .expect(400)
            .then( res => {
                expect(res.body.token).toBeFalsy()
            })
    })
})

describe('POST /login', () => {
    beforeAll(async () => {
        await db.clearUserTable()
        await utils.registerUser1(username, password, email)
    })

    describe('valid login credentials', () => {
        it('shold return with a token', async () => {
            return request(app)
                .post('/login')
                .send({username, password})
                .expect(200)
                .then(res => {
                    expect(res.body.token).toBeTruthy()
                })
        })
    })

    describe('invalid login credentials', () => {
        it('should return 400', async () => {
            return request(app)
                .post('/login')
                .send({username, password:'wrong_password'})
                .expect(400)
                .then(res => {
                    expect(res.body.token).toBeFalsy()
                })
        })
    })
})