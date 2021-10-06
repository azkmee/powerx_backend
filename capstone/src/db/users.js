const User = require('../models/user')
const checkListExistAndAccess = require('./utils')

module.exports = (pool) => {
    const db = {}

    db.insertUser = async (user) => {
        const res = await pool.query(
          'INSERT INTO Users (username,password_hash,email) VALUES ($1,$2,$3) RETURNING *',
          [user.username, user.password_hash, user.email]
        )
        return new User(res.rows[0])
    }

    db.findUserByUsernameEmail = async (username, email) => {
        const res = await pool.query(
          'SELECT * FROM Users WHERE username = $1 OR email = $2',
          [username, email]
        )
        return res.rowCount ? new User(res.rows[0]) : null
    }

    db.addUserAccess = async (uid, listid, email=null) => {
      if (email){
        const checkAccess = await checkListExistAndAccess(pool, listid, uid)
        if (checkAccess !== 200) {
          return checkAccess
        }

        const emailExist = await pool.query(
          `SELECT id FROM users 
            WHERE email = $1`,
            [email]
        )
        if (emailExist.rows.length == 0){
          return 'email doesnot exist'
        }

        const givenAccess = await pool.query(
          `SELECT * FROM UserAccess
            WHERE uid=$1 AND listid=$2`,
            [emailExist.rows[0].id, listid]
        )
        if (givenAccess.rows.length !== 0){
          return 'Email User already have access'
        }
        
        const res = await pool.query(
          'INSERT INTO UserAccess (uid, listid) VALUES ($1,$2) RETURNING *',
          [emailExist.rows[0].id, listid]
        )
        return 'Access granted'

      } else {
        await pool.query(
          'INSERT INTO UserAccess (uid, listid) VALUES ($1,$2) RETURNING *',
          [uid, listid]
        )
      }

    }

    return db;
}