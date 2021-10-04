const express = require('express');
const TodoItems = require('../models/todoitems');

module.exports = (db) => {
    const router = express.Router();

    router.post('/', async (req, res, next) => {
        // res.send(req.uid)
        const uid = req.uid
        const { name, todoListId } = req.body
        const addedItem = await db.addItem(new TodoItems({name, todoListId}))
        res.status(201).send(addedItem)
    })

    router.patch('/remove', (req, res, next) => {

    })

    router.patch('/update', (req, res, next) => {

    })

    return router;
}