'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import LocalWSServer from './modules/sockett'
import * as fs from 'fs'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null
let localWss: LocalWSServer | null
// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 1200, height: 800, frame: false })

  localWss = new LocalWSServer()
  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadFile('index.html')
  }
  if (localWss.closed) {
    localWss.start()
  }

  win.on('closed', () => {
    localWss = null
    win = null
  })
}
const Json2csvParser = require('json2csv').Parser
ipcMain.on('exportData', (event, args) => {
  console.log('asdasd')
  win.webContents.send('status', 'hola')
  const { data, savePath } = args
  const fields = ['value']
  const opts = { fields }
  const csvParser = new Json2csvParser(opts)
  for (const k in data) {
    console.log('saving...', k, data[k])
    const csv = csvParser.parse(data[k])
    console.log(savePath)
    try {
      fs.writeFileSync(savePath + '_' + k + '.csv', csv, 'utf-8')
      console.log('done!')
    } catch (e) {
      alert('Failed to save the file !')
    }
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (localWss !== null) {
    localWss.close()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
