<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="primary">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">WS Ardu ({{ipAddre}}:9300) - {{nc ? 'Ardu connected' : 'Ardu not connected' }}</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-on:click="saveFile">Export data</b-nav-item>
          <b-nav-item v-on:click="clear">Clear data</b-nav-item>
          <b-nav-item v-on:click="close">Close</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Home />
  </div>
</template>

<style lang="scss">
html,body, #app {
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/ws-ardu.epic.css'
import Home from '@/views/Home.vue'
import { remote } from 'electron'
const Json2csvParser = require('json2csv').Parser

@Component({
  components: {
  Home
  }
  })
export default class App extends Vue {
  get ipAddre () {
    return this.$store.state.localIp ? this.$store.state.localIp[0] : ''
  }

  get nc () {
    return this.$store.state.nc - 1 === 1
  }

  myWorker!:any

  created () {
    this.myWorker = this.$worker.create([
      { message: 'generateCsv', func: this.makeCsvReadyData }
    ])
  }

  clear () {
    this.$store.commit('CLEAR_SENSORS_DATA')
  }

  close () {
    remote.getCurrentWindow().close()
  }

  saveFile () {
    console.log('saving?')
    const savePath = remote.dialog.showSaveDialog({
      title: 'Export data',
      message: ':v'
    })
    const data = this.$store.state.sensors
    const ks = Object.keys(data)
    const theParser = new Json2csvParser({ ks })
    console.log(theParser)
    this.myWorker.postMessage('generateCsv', [data, theParser]).then((csvReadyData:any[]) => {
      if (csvReadyData.length > 0) {
        const csv = theParser.parse(csvReadyData)
        const fs = require('fs')
        console.log(savePath)
        try {
          fs.writeFileSync(savePath, csv, 'utf-8')
          console.log('done!')
        } catch (e) {
          alert('Failed to save the file !')
        }
      }
    }).catch(console.error)
  }

  makeCsvReadyData = (data: {string:number[]}) => {
    const csvReadyData: {}[] = []
    let notDone = true
    let i = 0
    while (notDone) {
      let mRes= {}
      let thisIsIt = 0
      for (const k in data) {
        const v = data[k] as number[]
        mRes[k] = v.length > i ? v[i] : -1
        thisIsIt = v.length > i ? thisIsIt + 1 : thisIsIt
      }
      i = i + 1
      notDone = thisIsIt > 1
      if (notDone) {
        csvReadyData.push(mRes)
      }
    }
    console.log(csvReadyData)
    return csvReadyData
  }
}
</script>
