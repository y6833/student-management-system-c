<template>
  <div class="chart-container">
    <div id="scoreDistributionChart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ScoreDistributionChart',
  props: {
    scoreData: {
      type: Array,
      default: () => []
    },
    totalStudents: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    scoreData: {
      handler() {
        this.initChart();
      },
      deep: true
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    this.chart && this.chart.dispose();
  },
  methods: {
    handleResize() {
      this.chart && this.chart.resize();
    },
    initChart() {
      if (!this.scoreData.length) return;

      const chartDom = document.getElementById('scoreDistributionChart');
      if (!chartDom) return;

      this.chart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const data = params[0];
            return `${data.name}<br/>人数：${data.value}人<br/>占比：${((data.value / this.totalStudents) * 100).toFixed(1)}%`;
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.scoreData.map(item => item.range),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: '#606266',
            interval: 0,
            rotate: 0
          },
          axisLine: {
            lineStyle: {
              color: '#dcdfe6'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '人数',
          nameTextStyle: {
            color: '#909399',
            padding: [0, 0, 0, 30]
          },
          axisLabel: {
            color: '#606266'
          },
          splitLine: {
            lineStyle: {
              color: '#ebeef5',
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '分数分布',
            type: 'bar',
            barWidth: '60%',
            data: this.scoreData.map(item => ({
              value: item.count,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#409EFF' },
                  { offset: 1, color: '#84bfff' }
                ])
              }
            })),
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#66b1ff' },
                  { offset: 1, color: '#a0cfff' }
                ])
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}人'
            }
          }
        ]
      };

      option && this.chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}

#scoreDistributionChart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
}
</style>
