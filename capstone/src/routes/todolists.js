const express = require('express')
const TodoLists = require('../models/todolists')
const TodoItems = require('../models/todoitems')

module.exports = (db) => {
    const router = express.Router();

    router.get('/all', async (req, res, next) => {
        const uid = await req.uid
        const allLists = await db.getAllLists(uid)
        console.log(allLists)
        res.send(allLists)
    })

    router.get('/by-id', async (req, res, next) => {
        const uid = await req.uid
        const listid = req.body.id
        const dbRes = await db.getListById(listid, uid)
        if (dbRes == 404){
            res.status(404).send('List id not found')
        } else if (dbRes == 403){
            res.status(403).send('User does not have access to this list')
        } else {
            res.send(dbRes)
        }
    })

    router.post('/', async (req, res, next) => {
        try{
            const name = req.body.name
            const uid = await req.uid
            const items = req.body.items
            if (name == null){
                throw ('List name not found')
            }
            const addedList = await db.addList(new TodoLists({name, uid}))
            db.addUserAccess(uid, addedList.id)
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
        const uid = await req.uid
        const listid = req.body.id

        const dbRes = await db.removeList(listid, uid)
        if (dbRes == 404){
            res.status(404).send('List id not found')
        } else if (dbRes == 403){
            res.status(403).send('User does not have access to this list')
        } else {
            res.send(`List of id ${listid} successfully deleted`)
        }
    })

    router.patch('/update', async (req, res, next) => {
        const uid = await req.uid
        const listid = req.body.id
        const name = req.body.newName
        const dbRes = await db.updateList(listid, uid, new TodoLists({name, uid}))
        console.log(dbRes, 'dbRes')

        if (dbRes == 404){
            res.status(404).send('List id not found')
        } else if (dbRes == 403){
            res.status(403).send('User does not have access to this list')
        } else {
            res.send(dbRes)
        }


    })

    return router;
}
