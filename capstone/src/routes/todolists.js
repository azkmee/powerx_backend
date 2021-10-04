const express = require('express')
const TodoLists = require('../models/todolists')
const TodoItems = require('../models/todoitems')

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
        try{
            const name = req.body.name
            const uid = await req.uid
            const items = req.body.items
            if (name == null){
                throw ('List name not found')
            }
            const addedList = await db.addList(new TodoLists({name, uid}))
            const addedItems = items.map(async item => {
                const addedItem =  await db.addItem(new TodoItems({name:item, todoListId: addedList.id }))
                return addedItem.name
            })
            console.log(addedItems)
            res.status(201).send({...addedList, items:addedItems})

        } catch (err) {
            res.status(400).send(err)
        }
    })

    router.patch('/remove', async (req, res, next) => {
    })

    router.patch('/update', async (req, res, next) => {

    })

    return router;
}
