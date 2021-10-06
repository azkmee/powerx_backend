require('dotenv').config({ path: '.env.test' })
const App = require('../src/app')
const Router = require('../src/routes')
const AuthMiddleware = require('../src/middleware/auth')
const AuthService = require('../src/service/auth')
const db = require('../src/db')

const utils = {}

const authService = AuthService(db)
const authMiddleware = AuthMiddleware(authService)
const router = Router(db, authService, authMiddleware)
const app = App(router)

utils.app = app
utils.db = db

utils.setup = async () => {
    await db.initialise()
    await db.clearUserAccessTable()
    await db.clearItemsTable()
    await db.clearListsTable()
    await db.clearUserTable()
}

utils.teardown = async () => {
    await db.end()
}

utils.registerUser1 = async (username = 'test_user1', password = 'test_password1', email='test_email1@yahoo.com') => {
    const token = await authService.registerUser(username, password, email)
    return `Bearer ${token}`
}

utils.registerUser2 = async (username = 'test_user2', password = 'test_password2', email='test_email2@yahoo.com') => {
    const token = await authService.registerUser(username, password, email)
    return `Bearer ${token}`
}

module.exports = utils