<template>
  <b-container class="h-40" fluid>
    <b-row class="my-auto">
      <b-col>
        <h4 v-if="!thereIsData">Waiting for sensoors data...</h4>
      </b-col>
    </b-row>
    <Sensor v-for="(value, key) in  sensorsData" v-bind:name="key"  v-bind:data="value" v-bind:key="key" />

  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Sensor from '@/components/SensorLog.vue' // @ is an alias to /src

@Component({
  components: {
  Sensor
  },
  })
export default class Home extends Vue {
  get ipAddre () {
    return this.$store.state.localIp
  }

  get sensorsData () {
    return this.$store.state.sensors
  }

  get thereIsData () {
    return this.$store.getters.hasSensors
  }
}
</script>
