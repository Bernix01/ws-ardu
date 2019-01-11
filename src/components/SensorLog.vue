<template>
  <b-card v-bind:title="last" v-bind:sub-title="name" class="my-4">
    <b-card-body>
      <b-row>
        <b-col v-for="(value, key) in excerpt" v-bind:key="key">
          <span>{{ value }}°</span>
        </b-col>
        <b-col sm="3">
          <div class="compass">
            <div class="compass-main">
              <!-- Rótulos | Labels -->
              <span class="north-label">0°</span>
              <span class="east-label">90°</span>
              <span class="west-label">270°</span>
              <span class="south-label">180°</span>
              <!-- Rosa dos Ventos | Compass Rose -->
              <div class="compass-rose">
                <!-- Pontos Cardiais | Cardial Points -->
                <div class="cardial-points">
                  <div class="north-pointer pointer"></div>
                  <div class="east-pointer pointer"></div>
                  <div class="west-pointer pointer"></div>
                  <div class="south-pointer pointer"></div>
                </div>
                <!-- Pontos Ordinais | Ordinal Points -->
                <div class="ordinal-points">
                  <div class="northeast-pointer"></div>
                  <div class="northwest-pointer"></div>
                  <div class="southeast-pointer"></div>
                  <div class="south-west-pointer"></div>
                </div>
              </div>
              <!-- Bt Center -->
              <div class="bt-center"></div>
              <!-- Agulha Magnética | Dip Needle -->
              <div class="dip-needle" :style="sstyle"></div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <line-chart
            :chart-data="datacollection"
            :options="{ aspectRatio: 0.3, animation: { duration: 0 } }"
            :height="100"
          ></line-chart>
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
  }
})
export default class Sensor extends Vue {
  @Prop({ default: '' })
  name!: string

  @Prop({ default: [] })
  data!: { value: number }[]

  get last() {
    return this.data.length > 0
      ? this.data[this.data.length - 1].value.toString()
      : '0'
  }

  get trailing(): number[] {
    return this.data
      ? this.data
          .map(v => v.value)
          .slice(Math.max(this.data.length - this.dataWindowSize, 1))
      : []
  }

  get excerpt(): number[] {
    const result = this.trailing
      ? this.trailing.slice(Math.max(this.trailing.length - 10, 1))
      : []
    return result
  }

  get sstyle() {
    return { transform: 'rotate(' + (parseFloat(this.last) - 40) + 'deg)' }
  }

  get datacollection() {
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

  get currWidth() {
    return this.$el.clientWidth
  }

  get dataWindowSize() {
    return this.$store.state.dataWindowSize
  }
}
</script>

<style scoped>
.compass {
  width: 260px;
  height: 260px;
  position: relative;
  margin: 0 auto;
  margin-bottom: 50px;
  background: linear-gradient(#ddd, #ccc 20%, #ddd);
  border-radius: 50%;
  box-shadow: 0 2px 6px 0.8px #999;
  animation: sliding 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  -webkit-animation: sliding 1.9s ease-in-out;
}

.compass:after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  top: -26px;
  left: 50%;
  margin-left: -16px;
  border: 6px solid #ddd;
  border-radius: 50%;
}

.compass-main {
  width: 94%;
  height: 94%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -47%;
  margin-left: -47%;
  background: radial-gradient(#eee 50%, #ddd 80%);
  border-radius: 50%;
}

.compass-rose {
  width: 70%;
  height: 70%;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -35%;
  margin-left: -35%;
}

.pointer {
  width: 0;
  height: 0;
  position: absolute;
  border: 80px solid;
  border-left: 14px solid;
  border-right: 14px solid;
}

.cardial-points .pointer {
  border-color: #ddd transparent transparent transparent;
}

.ordinal-points .pointer {
  border-color: #aaa transparent transparent transparent;
}

.north-pointer {
  top: -40px;
  margin-top: -40px;
  left: 50%;
  margin-left: -14px;
  -webkit-transform: rotate(180deg);
}

.east-pointer {
  top: 28%;
  right: -10px;
  margin-top: -40px;
  -webkit-transform: rotate(-90deg);
}

.west-pointer {
  top: 28%;
  left: -10px;
  margin-top: -40px;
  -webkit-transform: rotate(90deg);
}

.south-pointer {
  bottom: -40px;
  margin-bottom: -40px;
  left: 50%;
  margin-left: -14px;
}

.bt-center {
  width: 16px;
  height: 16px;
  position: absolute;
  z-index: 100000;
  top: 50%;
  left: 50%;
  margin-top: -8px;
  margin-left: -8px;
  display: block;
  background: #444;
  border-radius: 50%;
}

.dip-needle {
  width: 12px;
  height: 12px;
  position: absolute;
  z-index: 999;
  top: 50%;
  left: 50%;
  margin-top: -6px;
  margin-left: -6px;
  -webkit-animation: animation-dip-needle 1s linear 0s infinite;
}

.dip-needle:after {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  top: -138px;
  right: -54px;
  border: 80px solid;
  border-left: 6px solid;
  border-right: 6px solid;
  border-color: #b20000 transparent transparent transparent;
  -webkit-transform: rotate(220deg);
  z-index: -10000;
}

.dip-needle:before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  top: -10px;
  right: 54px;
  border: 80px solid;
  border-left: 6px solid;
  border-right: 6px solid;
  border-color: #ccc transparent transparent transparent;
  -webkit-transform: rotate(40deg);
}

.north-label {
  position: absolute;
  top: 10px;
  left: 116px;
}

.east-label {
  position: absolute;
  top: 114px;
  right: 12px;
}

.west-label {
  position: absolute;
  top: 114px;
  left: 12px;
}

.south-label {
  position: absolute;
  bottom: 6px;
  left: 116px;
}
</style>
