module.exports =  async (pool, listid, uid) => {
    const checkListExist = await pool.query(
        `SELECT listid FROM UserAccess 
            WHERE listid = $1`, [listid])
    if (checkListExist.rows.length == 0) {
        return 404
    }

    const checkAccess = await pool.query(
        `SELECT listid FROM UserAccess 
            WHERE listid = $1 AND uid = $2` , 
            [listid, uid])
    if (checkAccess.rows.length == 0) {
        return 403
    }

    return 200
}

