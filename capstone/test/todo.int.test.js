const request = require('supertest')
const utils = require('./utils')

const app = utils.app
const db = utils.db

let token1;
let token2;

beforeAll(async () => {
    await utils.setup()
    token1 = await utils.registerUser1()
    token2 = await utils.registerUser2()
})

afterAll(async () => {
    await utils.teardown()
})

describe('POST /lists', () => {
    describe('given no name in body', () => {
        beforeAll(async() => {
            await db.clearListsTable()
        })

        it('should return 400', async () => {
            return request(app)
                .post('/lists')
                .set('Authorization', token1)
                .send({})
                .expect(400)
        })
    })
    
    describe('given body with Name and items array', () => {
        beforeAll(async() => {
            await db.clearListsTable()
        })
        const newListsItems = {
            name:'Test List1',
            items:['test item 11','test item 12']
        }

        it('should return 200 and return new list and items ', async () => {
            return request(app)
                .post('/lists')
                .set('Authorization', token1)
                .send(newListsItems)
                .expect(201)
                .then(res => {
                    expect(res.body).toEqual(
                        expect.objectContaining({
                            ...newListsItems,
                            id:1
                        })
                    )
                })
        })

    })
})

describe('GET /lists/all', () => {
    describe('given no lists', () => {
        beforeAll(async() => {
            await db.clearListsTable()
        })
        const expectedRes = {}
        it('should return empty', async () => {
            return request(app)
                .get('/lists/all')
                .set('Authorization', token1)
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual(expectedRes)
                })
        })
    })

    describe('given some items in db', () => {
        const list1 = {
            name:'Test List1',
            items:['test item 11','test item 12']
        }
        const list2 = {
            name:'Test List2',
            items:['test item 21','test item 22']
        }
        beforeAll(async () => {
            await db.clearListsTable()
            await request(app)
                .post('/lists')
                .set('Authorization', token1)
                .send({...list1})
            await request(app)
                .post('/lists')
                .set('Authorization', token1)
                .send({...list2})
        })

        it('should return names of list', async () => {
            return request(app)
                .get('/lists/all')
                .set('Authorization', token1)
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual(
                        expect.arrayContaining(
                            [list1, list2].map((item, index) => {
                                return { id: index+1, name: item.name}
                            })
                        )
                    )
                })
        })
    })


    // describe('given a ')
})
