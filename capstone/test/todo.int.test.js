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

// describe('GET /lists/all', () => {
//     describe('given no lists', () => {
//         beforeAll(async() => {
//             await db.clearListsTable()
//         })
//         it('should return empty', async () => {

//         })
//     })

//     describe('given some items in db', () => {
//         const list = {

//         }
//         beforeAll(async () => {
//             await db.clearListsTable()
//             await Promise.all
//         })
//     })


//     describe('given a ')
// })
