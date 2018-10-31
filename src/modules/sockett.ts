import WebSocket from 'ws'
import flatmap from 'flatmap'
const port:number = 9300
export default class LocalWSServer {
  wss!:WebSocket.Server
  numClients: number = 0
  start () {
    console.log('spawning websocket server')
    console.log('starting... socket server')
    this.wss = new WebSocket.Server({ port: port })
    const localAddr = this.getLocalAddresses()
    console.log(`started websocket server on ${localAddr} port ${port}`)
    this.wss.on('connection', (ws) => {
      this.numClients = this.wss.clients.size
      const _wss = this.wss
      ws.on('message', (message) => {
        _wss && _wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message)
          }
        })
      })
      ws.on('disconnect',(ws,c,r)=> {
        const ncData = JSON.stringify({ t: 'nc', p: this.numClients })
        _wss && _wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(ncData)
          }
        })
      })
      ws.send(JSON.stringify({ t: 'ipAddr', p: localAddr }))
      const ncData = JSON.stringify({ t: 'nc', p: this.numClients })
      _wss && _wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(ncData)
        }
      })
    })
  }

  close () {
    this.wss.close()
  }

  getLocalAddresses () {
    const os = require('os')
    const interfaces = os.networkInterfaces()
    return flatmap(Object.values(interfaces), (address) => address.filter(this.isLocal).map(addr => addr.address), this)
  }

  isLocal (address) {
    return address.family === 'IPv4' && !address.internal
  }
}
