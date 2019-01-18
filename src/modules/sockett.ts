import WebSocket from 'ws'
import flatmap from 'flatmap'
import { BrowserWindow } from 'electron'
const port: number = 9300
export default class LocalWSServer {
  wss!: WebSocket.Server
  numClients: number = 0
  closed = true
  win!: BrowserWindow
  start(win: BrowserWindow) {
    console.log('spawning websocket server')
    console.log('starting... socket server')
    this.win = win
    this.wss = new WebSocket.Server({ port: port })
    this.closed = false
    const localAddr = this.getLocalAddresses()
    console.log(`started websocket server on ${localAddr} port ${port}`)
    console.log(this.win)
    this.win!.webContents.send('ip', localAddr)
    this.wss.on('connection', ws => {
      this.numClients = this.wss.clients.size
      this.win!.webContents.send('connected', this.numClients === 1)
      console.log('Connected: ' + this.numClients)
      ws.on('message', (message: string) => {
        this.win!.webContents.send('sensorData', JSON.parse(message))
      })
      ws.on('disconnect', (ws, c, r) => {
        console.log('disconected')
        this.win!.webContents.send('connected', this.wss.clients.size === 1)
      })
    })
  }

  close(cb?: ((err?: Error | undefined) => void) | undefined) {
    const cbb = cb || (err => (this.closed = !err))
    this.wss.close(cbb)
  }

  getLocalAddresses() {
    const os = require('os')
    const interfaces = os.networkInterfaces()
    return flatmap(
      Object.values(interfaces),
      address => address.filter(this.isLocal).map(addr => addr.address),
      this
    )
  }

  isLocal(address) {
    return address.family === 'IPv4' && !address.internal
  }
}
