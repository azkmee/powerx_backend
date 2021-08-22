const User = require("../model/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = parseInt(process.env.JWT_EXPIRE);
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);


module.exports = (db) => {
    const service = {}

    service.generateToken = (uid) => {
        return jwt.sign({uid}, JWT_SECRET, {expiresIn: JWT_EXPIRE})
    }

    service.registerUser = async (username, password) => {
        //check if user in database
        const user = await db.findUserbyUsername(username);
        

        if (user){
            return null
        } else {
            const password_hash = await bcrypt.hash(password, SALT_ROUNDS)
            const newUser = new User({username, password_hash})
            const user = await db.insertUser(newUser)
            return service.generateToken(user.id);
        }
    }

    service.login = async (username, password) => {
        const user = await db.findUserbyUsername(username);
        if (user) {
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (isValid) {
                return service.generateToken(user.id)
            }
        }

        return null;
    }

    service.verifyToken = (token) => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded.uid;
        } catch (err) {
            return null
        }
    }

    return service;
}
