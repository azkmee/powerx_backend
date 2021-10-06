const { TodoLists } = require('../models')
const checkListExistAndAccess = require('./utils')

module.exports = (pool) => {
    const db = {}

    db.addList = async (list) => {
        const res = await pool.query(
            'INSERT INTO TodoLists (name) VALUES ($1) RETURNING *',
            [list.name]
        ) 
        return new TodoLists(res.rows[0])
    }

    db.removeList = async (id, uid) => {

        const checkAccess = await checkListExistAndAccess(pool, id, uid)
        if (checkAccess !== 200) {
            return checkAccess
        }

        const res = await pool.query(
            `DELETE From UserAccess 
                WHERE listid = $1`,
                [id]
        )
        return res.rowCount
    }

    db.updateList = async (id, uid, list) => {
        const checkAccess = await checkListExistAndAccess(pool, id, uid)
        if (checkAccess !== 200) {
            return checkAccess
        }

        const res = await pool.query(
            'UPDATE TodoLists SET name=$2 WHERE id=$1 RETURNING *',
            [id, list.name]
        )
        return new TodoLists({...res.rows[0]})
    }

    db.getAllLists = async (uid) => {
        const res = await pool.query(
            `SELECT id, name FROM TodoLists 
                WHERE id IN (
                    SELECT listid FROM UserAccess 
                        WHERE uid = $1
                    )`
                ,[uid]
        )
        if (res.rows.length > 0){
            const toReturn = res.rows.map(row => {
                return new TodoLists({id:row.id, name:row.name})
            })
            return toReturn;

        } else return {}
    }


    db.getListById = async (listid, uid) => {
        const checkAccess = await checkListExistAndAccess(pool, listid, uid)

        if (checkAccess !== 200) {
            return checkAccess
        }

        const res = await pool.query(
            `SELECT id,name FROM TodoItems
                WHERE todolistid IN (
                    SELECT listid FROM UserAccess 
                        WHERE uid = $1 AND
                        listid = $2
                    ) AND
                    enable = $3`,[uid, listid, true]
        )
        return res.rows;
    }
    
    return db;
}