const express = require('express')

module.exports = (db, authService, AuthMiddleware ) => {
    const router = express.Router()

    router.get('/', (req, res, next) => {
        res.send('Hello World');
    })

    router.use('/', require('./auth')(authService))

    router.use(AuthMiddleware)

    router.use('/lists', require('./todolists')(db))
    router.use('/items', require('./todoitems')(db))
    router.use('/accounts', require('./accesslists')())

    


    return router;
}