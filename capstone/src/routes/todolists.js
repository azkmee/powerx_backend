const express = require('express')

module.exports = (db) => {
    const router = express.Router();

    router.get('/all', async (req, res, next) => {
        // console.log(req.uid)
        res.send('hello')
    })

    router.get('/by-id', async (req, res, next) => {

    })

    router.post('/', async (req, res, next) => {

    })

    router.patch('/remove', async (req, res, next) => {

    })

    router.patch('/update', async (req, res, next) => {

    })

    return router;
}
