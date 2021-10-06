require('dotenv').config({path:'../../.env'})
const { Pool } = require('pg')

let pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

const db = {
    ...require('./users.js')(pool),
    ...require('./todoitems')(pool),
    ...require('./todolists')(pool),
}


db.initialise = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(100) NOT NULL,
            password_hash VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL
        )
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS TodoLists (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        )
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS TodoItems (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            todolistid INTEGER NOT NULL,
            FOREIGN KEY (todolistid) REFERENCES TodoLists(id) on DELETE CASCADE,
            enable BOOLEAN NOT NULL
        )
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS UserAccess (
            uid INTEGER NOT NULL,
            FOREIGN KEY (uid) REFERENCES Users(id) on DELETE CASCADE,
            listid INTEGER NOT NULL,
            FOREIGN KEY (listid) REFERENCES TodoLists(id) on DELETE CASCADE
        )
    `)
}

db.clearUserTable = async () => {
    await pool.query(`DELETE FROM Users`)
    await pool.query(`ALTER SEQUENCE Users_id_seq RESTART`)
}

db.clearUserAccessTable = async () => {
    await pool.query(`DELETE FROM Useraccess`)
}

db.clearItemsTable = async () => {
    await pool.query(`DELETE FROM todoitems`)
    await pool.query(`ALTER SEQUENCE todoitems_id_seq RESTART`)
}
db.clearListsTable = async () => {
    await pool.query(`DELETE FROM todolists`)
    await pool.query(`ALTER SEQUENCE todolists_id_seq RESTART`)
}

db.end = async () => {
    await pool.end()
}

module.exports = db