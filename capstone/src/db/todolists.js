const TodoLists = require('../models/todolists')

module.exports = (pool) => {
    const db = {}

    db.addList = async (list) => {
        const res = await pool.query(
            'INSERT INTO TodoLists (name, enable) VALUES ($1,$2) RETURNING *',
            [list.name, true]
        ) 
        return new TodoItems(res.rows[0])
    }

    db.removeList = async (id) => {
        const res = await pool.query(
            'UPDATE TodoItems SET enable=$2 WHERE id=$1 RETURNING *',
            [id, false]
        )
        return new TodoItems(res.rows[0])
    }

    db.updateList = async (id, list) => {
        const res = await pool.query(
            'UPDATE TodoItems SET name=$2 WHERE id=$1 RETURNING *',
            [id, item.name]
        )
        return new TodoItems(res.rows[0])
    }

    db.getAllLists = async (uid) => {
        const res = await pool.query(
            `SELECT name FROM TodoLists 
                WHERE id IN (
                    SELECT listid FROM UserAccess 
                        WHERE uid = $1
                    ) AND
                    enable = $2`,[uid, true]
        )
        if (res.length > 0){
            const toReturn = res.map(row => {
                return new TodoLists(row.id, row.name)
            })
        } else return {}
        

        return toReturn
    }
    //return all list titles

    db.getListById
    //return items


    
    return db;
}