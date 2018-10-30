import {
  spawn
} from 'child_process'

let child = spawn('node', ['worker.js'], {
  stdio: ['inherit', 'inherit', 'inherit', 'ipc']
})

const wkk: {
  start: Function
} = {
  start: () => {
    console.log('spawning websocket server')
    child.send('ping')
  }
}

export {
  wkk
}