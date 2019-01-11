// const Json2csvParser = require('json2csv').Parser
// import * as fs from 'fs'

// const ctx: Worker = self as any

// ctx.postMessage({ foo: 'foo' })

// ctx.addEventListener('message', event => {
//   console.log(event.data)
//   const { data, savePath } = event.data
//   const fields = ['value']
//   const opts = { fields }
//   const csvParser = new Json2csvParser(opts)
//   for (const k in data) {
//     console.log('saving...', k, data[k])
//     const csv = csvParser.parse(data[k])
//     console.log(savePath)
//     try {
//       fs.writeFileSync(savePath + '_' + k + '.csv', csv, 'utf-8')
//       console.log('done!')
//     } catch (e) {
//       alert('Failed to save the file !')
//     }
//   }
// })
