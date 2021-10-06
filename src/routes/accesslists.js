const express = require('express');
const KEYWORDS = require('../keywords');
const newMessage = require('../messageBroker/producer');

module.exports = () => {
    const router = express.Router();

    router.post('/grant-access', async (req, res, next) => {
        const uid = await req.uid
        const messageContent = req.body

        //post on rabbitmq
        await newMessage({...messageContent, uid})
        res.send(KEYWORDS.SEND_TO_QUEUE)

    })

    return router;
}