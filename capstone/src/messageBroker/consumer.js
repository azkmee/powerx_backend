require('dotenv').config()
const amqplib = require('amqplib');
const db = require('../db');
const KEYWORDS = require('../keywords');


const queue = KEYWORDS.GRANT_ACCESS;

(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)

  channel.consume(queue, async (msg) => {
    const {id, email, uid} = JSON.parse(msg.content)
    const res = await db.addUserAccess(uid, id, email)
    console.log(res)
    channel.ack(msg)
  })

})()



