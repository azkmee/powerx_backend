const express = require('express')
const logger = require('morgan')
const enableWs = require('express-ws')
const cron = require('node-cron')
const sendNewMessage = require('./producer')


const app = express()
app.use(logger('common'))

enableWs(app)

app.ws('/heartbeat', (ws, req) => {
  cron.schedule('0 * * * * *', () => {
    const date  = new Date()
    const msg = `I'm alive at ${date}`
    ws.send(msg);
    sendNewMessage(msg);
  })

  cron.schedule('0 42 * * * *', () => {
      ws.send(`42 is the meaing of life`)
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})


