import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: {},
      reconnectError: false
    },
    localIp: '',
    sensors: {},
    dataWindowSize: 50,
    nc: 0
  },
  getters: {
    hasSensors: (state, getters) => {
      return getters.sensorsCount > 0
    },
    sensorsCount: (state, getters) => {
      return Object.keys(state.sensors).length
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event) {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event) {
      // console.error(state, event)
    },
    SOCKET_ONMESSAGE (state, message: { t: string, p: string | number }) {
      if (message.t === 'ipAddr') {
        state.localIp = message.p as string
      } else if (message.t === 'nc') {
        state.nc = message.p as number
      } else {
        if (message.t in state.sensors) {
          state.sensors[message.t].push(message.p as number)
          Vue.extend()
        } else {
          Vue.set(state.sensors, message.t, [message.p as number])
        }
      }
    },
    SOCKET_RECONNECT (state, count) {
      // console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR (state) {
      state.socket.reconnectError = true
    },
    CLEAR_SENSORS_DATA (state) {
      state.sensors = {}
    }
  },
  actions: {
    sendMessage: function (context, message) {
      Vue.prototype.$socket.send(message)
    }
  }
})
