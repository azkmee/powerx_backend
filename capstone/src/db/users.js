const User = require('../models/user')

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

    return db;
}