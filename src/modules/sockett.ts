import WebSocket from 'ws'
import flatmap from 'flatmap'
const port:number = 9300
export default class LocalWSServer {
  wss!:WebSocket.Server
  numClients: number = 0
  closed = true
  start () {
    console.log('spawning websocket server')
    console.log('starting... socket server')
    this.wss = new WebSocket.Server({ port: port })
    this.closed = false
    const localAddr = this.getLocalAddresses()
    console.log(`started websocket server on ${localAddr} port ${port}`)
    this.wss.on('connection', (ws) => {
      this.numClients = this.wss.clients.size
      const _wss = this.wss
      console.log("Connected: " + this.numClients);
      ws.on('message', (message) => {
        this.broadcast(_wss, ws, message);
      })
      ws.on('disconnect',(ws,c,r)=> {
        const ncData = JSON.stringify({ t: 'nc', p: this.numClients })
        this.broadcast(_wss,ws,ncData)
      })
      ws.send(JSON.stringify({ t: 'ipAddr', p: localAddr }))
      const ncData = JSON.stringify({ t: 'nc', p: this.numClients })
      this.broadcast(_wss,ws,ncData)
    })
  }

  private broadcast(_wss: WebSocket.Server, ws: WebSocket, message: WebSocket.Data) {
    _wss && _wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  close (cb?: ((err?: Error | undefined) => void) | undefined) {
    const cbb = cb || ((err) => this.closed = !err)
    this.wss.close(cbb)
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
