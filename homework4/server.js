const WebSocket = require("ws")
const wss = new WebSocket.Server({ port: 3001 })

function broadcast(clientId, message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`[${clientId}]: ${message}`)
    }
  })
}

let id = 0

wss.on("connection", ws => {
  ws.id = id++
  ws.on("message", message => broadcast(ws.id, message))
})