<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="primary" class="drag">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#"
        >WS Ardu ({{ ipAddre }}:9300) -
        {{ nc ? 'Ardu connected' : 'Ardu not connected' }}</b-navbar-brand
      >
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-on:click="saveFile" class="no-drag"
            >Export data</b-nav-item
          >
          <b-nav-item v-on:click="clear" class="no-drag">Clear data</b-nav-item>
          <b-nav-item v-on:click="close" class="no-drag">Close</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <Home />
    <!-- Modal Component -->
    <b-modal id="modal1" title="Bootstrap-Vue" ref="myModalRef">
      <pre class="my-4">{{ csvStr }}</pre>
    </b-modal>
  </div>
</template>

<style lang="scss">
html,
body,
#app {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.drag {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
</style>

<script lang="ts">
/* eslint:disable:import/no-webpack-loader-syntax */
import { Component, Vue } from 'vue-property-decorator'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/ws-ardu.epic.css'
import Home from '@/views/Home.vue'
import { remote, ipcRenderer } from 'electron'
import Worker from 'worker-loader!./saver.worker'
const Json2csvParser = require('json2csv').Parser

@Component({
  components: {
    Home
  }
})
export default class App extends Vue {
  csvStr = ''
  get ipAddre() {
    return this.$store.state.localIp ? this.$store.state.localIp[0] : ''
  }

  get nc() {
    return this.$store.state.nc - 1 === 1
  }

  created() {
    ipcRenderer.on('status', (event, args) => {
      console.log(event)
      console.log(args)
    })
  }

  clear() {
    this.$store.commit('CLEAR_SENSORS_DATA')
  }

  close() {
    remote.getCurrentWindow().close()
  }

  saveFile() {
    let csv = ''
    const fields = ['value']
    const opts = { fields }

    const data = this.$store.state.sensors
    console.log(data)
    for (const k in data) {
      const sdata = data[k]
      console.log('saving...', k, sdata)
      const name = k
      const csvParser = new Json2csvParser(opts)
      console.log(csvParser)
      const csvv = csvParser.parse(sdata)
      console.log(csvv)
      csv += '\n\n' + name + '\n'
      csv += csvv
    }
    this.csvStr = csv
    ;(this.$refs.myModalRef as any).show()

    // console.log('saving?')
    // const savePath = remote.dialog.showSaveDialog({
    //   title: 'Export data',
    //   message: ':v'
    // })
    // const data2 = this.$store.state.sensors
    // console.log('emitting data')
    // ipcRenderer.sendSync('exportData', data2)
  }
}
</script>
