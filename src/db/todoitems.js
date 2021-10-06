const { TodoItems } = require('../models')
const checkListExistAndAccess = require('./utils')

module.exports = (pool) => {
    const db = {}

    db.addItem = async (item, uid) => {
        const listId = item.todoListId
        const checkAccess = await checkListExistAndAccess(pool, listId, uid)
        if (checkAccess !== 200) {
            return checkAccess
        }

        const res = await pool.query(
            'INSERT INTO TodoItems (name, enable, todolistid) VALUES ($1,$2,$3) RETURNING *',
            [item.name, true, listId]
        )
        return new TodoItems(res.rows[0])
    }

    db.removeItem = async (id, uid) => {
        const listId = await pool.query(
            `SELECT todolistid FROM todoitems
                WHERE id=$1 AND enable=$2`,
                [id, true]
        )
        if (listId.rows.length == 0){
            return 404
        }
        const checkAccess = await checkListExistAndAccess(pool, listId.rows[0].todolistid, uid)
        if (checkAccess !== 200) {
            return checkAccess
        }

        const res = await pool.query(
            'UPDATE TodoItems SET enable=$2 WHERE id=$1 RETURNING name',
            [id, false]
        )
        return new TodoItems(res.rows[0])
    }

    db.updateItem = async (id, uid, item) => {
        const listId = await pool.query(
            `SELECT todolistid FROM todoitems
                WHERE id=$1 AND enable=$2`,
                [id, true]
        )
        if (listId.rows.length == 0){
            return 404
        }
        const checkAccess = await checkListExistAndAccess(pool, listId.rows[0].todolistid, uid)
        if (checkAccess !== 200) {
            return checkAccess
        }

        const res = await pool.query(
            'UPDATE TodoItems SET name=$2 WHERE id=$1 RETURNING *',
            [id, item.name]
        )
        return new TodoItems(res.rows[0])
    }

    return db;
}