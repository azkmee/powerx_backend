const express = require('express')

module.exports = (db) => {
    const router = express.Router();

    router.get('/all', async (req, res, next) => {
        console.log(req.uid, 'reouter')
        const uid = await req.uid
        const allLists = db.getAllLists(uid)
        console.log(allLists)
        res.send(allLists)
    })

    router.get('/by-id', async (req, res, next) => {

    })

    router.post('/', async (req, res, next) => {
        console.log(req.body)
        res.send('ok')
    })

    router.patch('/remove', async (req, res, next) => {

    })

    router.patch('/update', async (req, res, next) => {

    })

    return router;
}
