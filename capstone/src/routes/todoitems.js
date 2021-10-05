const express = require('express');
const { TodoItems } = require('../models')
const KEYWORDS = require('../keywords');

module.exports = (db) => {
    const router = express.Router();

    router.post('/', async (req, res, next) => {
        const uid = await req.uid
        const { name, todoListId } = req.body
        const dbRes = await db.addItem(new TodoItems({name, todoListId}), uid)
        
        if (dbRes == 404){
            res.status(404).send(KEYWORDS.LIST_ID_NOT_FOUND)
        } else if (dbRes == 403){
            res.status(403).send(KEYWORDS.UNAUTHORISED_USER)
        } else {
            res.send(dbRes)
        }
    })

    router.patch('/remove', async (req, res, next) => {
        const uid = await req.uid
        const id = req.body.id
        const dbRes = await db.removeItem(id, uid)

        if (dbRes == 404){
            res.status(404).send(KEYWORDS.LIST_ID_NOT_FOUND)
        } else if (dbRes == 403){
            res.status(403).send(KEYWORDS.UNAUTHORISED_USER)
        } else {
            res.send(dbRes)
        }
    })

    router.patch('/update', async (req, res, next) => {
        const uid = await req.uid
        const { id, name } = req.body
        const dbRes = await db.updateItem(id, uid, new TodoItems({name}))

        if (dbRes == 404){
            res.status(404).send(KEYWORDS.LIST_ID_NOT_FOUND)
        } else if (dbRes == 403){
            res.status(403).send(KEYWORDS.UNAUTHORISED_USER)
        } else {
            res.send(dbRes)
        } 
    })

    return router;
}