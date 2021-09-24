const amqplib = require('amqplib')

const queue = 'newMessage'

const newMessage = async (message) => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)
  console.log(message)
  // const message = { hello: 'world' }
  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    contentType: 'application/json',
  })
  await channel.close();
  await client.close();
}

module.exports = newMessage