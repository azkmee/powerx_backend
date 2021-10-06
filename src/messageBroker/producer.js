const amqplib = require('amqplib')
const KEYWORDS = require('../keywords');
require('dotenv').config()

const queue = KEYWORDS.GRANT_ACCESS;

const newMessage = async (message) => {
  const client = await amqplib.connect(process.env.CLOUDAMQP_URL || 'amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)
  console.log(message)

  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    contentType: 'application/json',
  })
  await channel.close();
  await client.close();
}

module.exports = newMessage
