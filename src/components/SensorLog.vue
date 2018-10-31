<template>
  <b-card v-bind:title="last" v-bind:sub-title="name" class="my-4">
    <b-card-body>
      <b-row>
        <b-col v-for="d in excerpt" v-bind:key="d"><span>{{d}}</span></b-col>
      </b-row>
      <b-row>
        <b-col>
        <line-chart :chart-data="datacollection" :options="{aspectRatio: 0.3, animation: { duration: 0 }}" :height="100"></line-chart>
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import LineChart from './SensorChart.js'

@Component({
  components: {
  LineChart
  },
  })
export default class Sensor extends Vue {
  @Prop({ default: '' })
  name!: string

  @Prop({ default: [] })
  data!: number[]

  get last () {
    return this.data.length > 0 ? this.data[this.data.length -1].toString() : '0'
  }

  get trailing () {
    return this.data ? this.data.slice(Math.max(this.data.length - this.dataWindowSize, 1)) : [0]
  }

  get excerpt () {
    return this.trailing ? this.trailing.slice(Math.max(this.trailing.length - 10, 1)) : [0]
  }

  get datacollection () {
    return {
      labels: [...this.trailing.keys()],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#bbbbbb',
          data: this.trailing
        }
      ]
    }
  }

  get currWidth () {
    return this.$el.clientWidth
  }

  get dataWindowSize () {
    return this.$store.state.dataWindowSize
  }
}
</script>

<style>

</style>
