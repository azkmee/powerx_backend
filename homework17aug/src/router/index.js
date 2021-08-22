const { Router } = require("express")
const items = require('./items')

module.exports = (authService, authMiddle, db) => {
    
    const router = Router();

    router.get('/', (req, res, next) => {
        res.send('Hello World');
    })
    // router.use('/items', items(db))
    router.use('/', require('./auth')(authService))

    router.use(authMiddle)

    router.use('/items', items(db))

    return router;
}