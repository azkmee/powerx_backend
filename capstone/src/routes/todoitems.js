const express = require('express')

module.exports = (db) => {
    const router = express.Router();

    router.post('/', (req, res, next) => {
        res.send(req.uid)
    })

    router.patch('/remove', (req, res, next) => {

    })

    router.patch('/update', (req, res, next) => {

    })

    return router;
}