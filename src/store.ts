import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    SET_IP(state, ip) {
      state.localIp = ip
    },
    SET_CONNECTED(state, isConnected) {
      state.nc = isConnected
    },
    SET_DATA(state, data: { t: string; p: { value: string } }) {
      if (data.t in state.sensors) {
        state.sensors[data.t].push(data.p)
      } else {
        Vue.set(state.sensors, data.t, [data.p])
      }
    },
    CLEAR_SENSORS_DATA(state) {
      state.sensors = {}
    }
  },
  actions: {
  }
})
