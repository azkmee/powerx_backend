const amqplib = require('amqplib')
const fs = require('fs');

const queue = 'newMessage'

;(async () => {
  const client = await amqplib.connect('amqp://localhost:5672')
  const channel = await client.createChannel()
  await channel.assertQueue(queue)

  channel.consume(queue, (msg) => {
    const data = JSON.parse(msg.content)
    fs.appendFile('message.txt', data, function (err) {
      if (err) throw err;
      // console.log('Saved!');
      channel.ack(msg)
    })
  })

})()

