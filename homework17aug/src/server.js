require('dotenv').config()
const db = require('./db');
const Router = require('./router');
const App = require('./app');

const AuthService = require('./services/auth')
const AuthMiddle = require('./middleware/auth')
const authService = AuthService(db)
const authMiddleware = AuthMiddle(authService)

const router = Router(authService, authMiddleware, db);
const app = App(router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
})
