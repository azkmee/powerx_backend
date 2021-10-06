const express = require('express')
const { TodoItems, TodoLists } = require('../models')
const KEYWORDS = require('../keywords')

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
            res.status(404).send(KEYWORDS.LIST_ID_NOT_FOUND)
        } else if (dbRes == 403){
            res.status(403).send(KEYWORDS.UNAUTHORISED_USER)
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
                throw Error(KEYWORDS.INPUT_NAME_NOT_FOUND)
            }
            const addedList = await db.addList(new TodoLists({name, uid}))
            await db.addUserAccess(uid, addedList.id)
            const addedItems = Promise.all(items.map( item => {
                return db.addItem(new TodoItems({name:item, todoListId: addedList.id }), uid)
                    .then(res => {
                        return res.name
                    })
            }))
            addedItems.then(items => {
                res.status(201).send({...addedList, items})
            })

        } catch (err) {
            res.status(400).send(err)
        }
    })

    router.patch('/remove', async (req, res, next) => {
        const uid = await req.uid
        const listid = req.body.id

        const dbRes = await db.removeList(listid, uid)
        if (dbRes == 404){
            res.status(404).send(KEYWORDS.LIST_ID_NOT_FOUND)
        } else if (dbRes == 403){
            res.status(403).send(KEYWORDS.UNAUTHORISED_USER)
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
            res.status(404).send(KEYWORDS.LIST_ID_NOT_FOUND)
        } else if (dbRes == 403){
            res.status(403).send(KEYWORDS.UNAUTHORISED_USER)
        } else {
            res.send(dbRes)
        }


    })

    return router;
}
