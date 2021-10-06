require('dotenv').config()
const App = require('./app')
const Router = require('./routes')
const db = require('./db')
const AuthService = require('./service/auth')(db)
const AuthMiddleware = require('./middleware/auth')(AuthService)
const router = Router(db, AuthService, AuthMiddleware)
const app = App(router)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})