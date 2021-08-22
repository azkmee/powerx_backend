const express = require('express')

module.exports = (authService) => {
    const route = express.Router();

    route.post('/register', async (req, res, next) => {
        const {username, password} = req.body
        const token = await authService.registerUser(username, password);
        if(token) {
            res.send({token:token})
        } else {
            res.status(400).send(`Username ${username} already exist`)
        }
    })

    route.post('/login', async (req, res, next) => {
        const {username, password} = req.body
        const token = await authService.login(username, password);
    
        if (token) {
            res.send({token:token})
        } else {
            res.status(400).send(`Invalid login credential`);
        }
    })
    return route
}