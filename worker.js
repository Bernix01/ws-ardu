
const WebSocket = require('ws')
const http = require('http')
const flatmap = require('flatmap')
const port = process.env.WS_PORT || 9300
let wss = null
process.on('message', (data) => {
  console.log('starting... socket server')
  wss = new WebSocket.Server({ port: port })
  const localAddr = getLocalAddresses()
  console.log(`started websocket server on ${localAddr} port ${port}`)
  wss.on('connection', (ws) => {
    ws.on('message', broadcast)
    ws.send(JSON.stringify({ t: 'ipAddr', p: localAddr }))
  })
})

function broadcast (message) {
  wss && wss.clients.forEach((client) => {
    if (client !== this && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

function getLocalAddresses () {
  const os = require('os')
  const interfaces = os.networkInterfaces()
  return flatmap(Object.values(interfaces), (address) => address.filter(isLocal).map(addr => addr.address))
}

function isLocal (address) {
  return address.family === 'IPv4' && !address.internal
}
