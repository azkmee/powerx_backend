const express = require('express')
const Item = require('../model/item')

module.exports = (db) => {
    const router = express.Router();

    // router.get('/', async (req, res, next) => {
    //     const items = await db.getAllItems();
    //     res.send(items);
    // })

    //HOMEWORK 17aug
    router.get('/', async (req, res, next) => {
        const uid = req.uid;
        const items = await db.getMyItems(uid);
        res.send(items);
    })

    router.get('/:id', async (req, res, next) => {
        const id = req.params.id;
        const item = await db.getItem(id);
        if (item) {
            res.send(item);
        } else {
            res.status(400).send(`Item id ${id} not found`)
        }
    
    })

    router.post('/', async (req, res, next) => {
        const uid = req.uid
        const {name, quantity} = req.body
        const newItem = new Item({name, quantity, uid});

        //post to db
        const item = await db.insertItem(newItem)
        res.status(201).send(item)
    })

    //HOMEWORK 17aug
    router.put('/:id', async (req, res, next) => {
        const uid = req.uid
        const id = req.params.id
        const {name, quantity} = req.body
        const currentItem = await db.getItem(id);
        if (currentItem.uid === uid){
            const editedItem = new Item({name, quantity, uid});

            //edit to db
            const item = await db.updateItem(id, editedItem)
            res.send(item)
        } else {
            res.status(403).send(`User ${uid} not authorized to edit Item ${id}`)
        }
        
    })

    router.delete('/:id', async (req, res, next) => {
        const id = req.params.id;
        const success = await db.deleteItem(id)

        //post to 
        if (success) {
            res.send(`Deleted item ${id} successfully`)
          } else {
            res.status(400).send(`Item id ${id} not found`)
          }
    })
    return router

}