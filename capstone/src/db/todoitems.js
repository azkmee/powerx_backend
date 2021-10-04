const TodoItems = require('../models/todoitems')

module.exports = (pool) => {
    const db = {}

    db.addItem = async (item) => {
        const res = await pool.query(
            'INSERT INTO TodoItems (name, enable, todolistid) VALUES ($1,$2,$3) RETURNING *',
            [item.name, true, item.todoListId]
        )
        return new TodoItems(res.rows[0])
    }

    db.removeItem = async (id) => {
        const res = await pool.query(
            'UPDATE TodoItems SET enable=$2 WHERE id=$1 RETURNING *',
            [id, false]
        )
        return new TodoItems(res.rows[0])
    }

    db.updateItem = async (id, item) => {
        const res = await pool.query(
            'UPDATE TodoItems SET name=$2 WHERE id=$1 RETURNING *',
            [id, item.name]
        )
        return new TodoItems(res.rows[0])
    }

    return db;
}