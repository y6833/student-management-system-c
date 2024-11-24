<template>
  <view class="trend-analysis">
    <view class="chart-header">
      <text class="title">成绩趋势分析</text>
      <view class="chart-controls">
        <text 
          v-for="(type, index) in chartTypes" 
          :key="index"
          :class="['control-item', { active: currentType === type.value }]"
          @tap="switchChartType(type.value)"
        >
          {{ type.label }}
        </text>
      </view>
    </view>

    <view class="chart-container" :class="{ loading: !trendData.length }">
      <view v-if="!trendData.length" class="no-data">暂无趋势数据</view>
      <view v-else id="scoreTrendChart"></view>
    </view>

    <view v-if="trendData.length" class="trend-summary">
      <view class="summary-item">
        <text class="label">最高分</text>
        <text class="value">{{ maxScore }}</text>
        <text class="desc">{{ maxScoreExam }}</text>
      </view>
      <view class="summary-item">
        <text class="label">最低分</text>
        <text class="value">{{ minScore }}</text>
        <text class="desc">{{ minScoreExam }}</text>
      </view>
      <view class="summary-item">
        <text class="label">平均分</text>
        <text class="value">{{ averageScore }}</text>
      </view>
      <view class="summary-item">
        <text class="label">趋势</text>
        <text class="value" :class="trendDirection.class">{{ trendDirection.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ScoreTrendChart',
  props: {
    trendData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      currentType: 'line',
      chartTypes: [
        { label: '折线图', value: 'line' },
        { label: '柱状图', value: 'bar' }
      ]
    };
  },
  computed: {
    maxScore() {
      if (!this.trendData.length) return '0';
      return Math.max(...this.trendData.map(item => item.averageScore)).toFixed(1);
    },
    minScore() {
      if (!this.trendData.length) return '0';
      return Math.min(...this.trendData.map(item => item.averageScore)).toFixed(1);
    },
    averageScore() {
      if (!this.trendData.length) return '0';
      const sum = this.trendData.reduce((acc, curr) => acc + curr.averageScore, 0);
      return (sum / this.trendData.length).toFixed(1);
    },
    maxScoreExam() {
      if (!this.trendData.length) return '';
      const maxIndex = this.trendData.findIndex(item => item.averageScore === parseFloat(this.maxScore));
      return this.trendData[maxIndex]?.examName || '';
    },
    minScoreExam() {
      if (!this.trendData.length) return '';
      const minIndex = this.trendData.findIndex(item => item.averageScore === parseFloat(this.minScore));
      return this.trendData[minIndex]?.examName || '';
    },
    trendDirection() {
      if (this.trendData.length < 2) return { text: '数据不足', class: '' };
      
      const lastTwo = this.trendData.slice(-2);
      const diff = lastTwo[1].averageScore - lastTwo[0].averageScore;
      
      if (diff > 0) {
        return { text: '上升', class: 'trend-up' };
      } else if (diff < 0) {
        return { text: '下降', class: 'trend-down' };
      } else {
        return { text: '持平', class: 'trend-stable' };
      }
    }
  },
  watch: {
    trendData: {
      handler() {
        this.initChart();
      },
      deep: true
    },
    currentType() {
      this.initChart();
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
    switchChartType(type) {
      this.currentType = type;
    },
    initChart() {
      if (!this.trendData.length) return;

      const chartDom = document.getElementById('scoreTrendChart');
      if (!chartDom) return;

      this.chart = echarts.init(chartDom);

      const baseOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          formatter: (params) => {
            const data = params[0];
            return `${data.name}<br/>
                    平均分：${data.value}<br/>
                    排名：${this.trendData[data.dataIndex].rank || '暂无'}`;
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
          data: this.trendData.map(item => item.examName),
          boundaryGap: this.currentType === 'bar',
          axisLabel: {
            color: '#606266',
            interval: 0,
            rotate: 30
          },
          axisLine: {
            lineStyle: {
              color: '#dcdfe6'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '分数',
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
        }
      };

      const seriesOption = this.currentType === 'line' ? {
        name: '平均分',
        type: 'line',
        data: this.trendData.map(item => item.averageScore),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#409EFF',
          borderWidth: 2,
          borderColor: '#fff'
        },
        lineStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#84bfff' }
          ]),
          width: 3
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0.1)' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: '#66b1ff',
            borderWidth: 3
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: '最高' },
            { type: 'min', name: '最低' }
          ],
          label: {
            formatter: '{b}: {c}'
          }
        },
        markLine: {
          data: [
            { type: 'average', name: '平均' }
          ],
          label: {
            formatter: '平均: {c}'
          },
          lineStyle: {
            color: '#909399',
            type: 'dashed'
          }
        }
      } : {
        name: '平均分',
        type: 'bar',
        data: this.trendData.map(item => item.averageScore),
        barWidth: '40%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#84bfff' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#66b1ff' },
              { offset: 1, color: '#a6d0ff' }
            ])
          }
        },
        markLine: {
          data: [
            { type: 'average', name: '平均' }
          ],
          label: {
            formatter: '平均: {c}'
          },
          lineStyle: {
            color: '#909399',
            type: 'dashed'
          }
        }
      };

      const option = {
        ...baseOption,
        series: [seriesOption]
      };

      option && this.chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.trend-analysis {
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 28rpx;
  color: #303133;
  font-weight: bold;
}

.chart-controls {
  display: flex;
  gap: 20rpx;
}

.control-item {
  font-size: 24rpx;
  color: #606266;
  padding: 8rpx 16rpx;
  border-radius: 4rpx;
  background: #f5f7fa;
  transition: all 0.3s;
}

.control-item.active {
  color: #409EFF;
  background: #ecf5ff;
}

.chart-container {
  width: 100%;
  height: 400rpx;
  position: relative;
}

.chart-container.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-data {
  text-align: center;
  color: #909399;
  font-size: 28rpx;
}

#scoreTrendChart {
  width: 100%;
  height: 100%;
}

.trend-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f5f7fa;
  border-radius: 8rpx;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.label {
  font-size: 24rpx;
  color: #909399;
  margin-bottom: 8rpx;
}

.value {
  font-size: 32rpx;
  color: #303133;
  font-weight: bold;
}

.desc {
  font-size: 20rpx;
  color: #909399;
  margin-top: 4rpx;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

.trend-stable {
  color: #e6a23c;
}

@media screen and (max-width: 768rpx) {
  .trend-summary {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-container {
    height: 350rpx;
  }
}
</style>
