<template>
  <view class="class-comparison">
    <view class="comparison-header">
      <text class="title">班级对比分析</text>
    </view>
    
    <view class="comparison-charts">
      <!-- 平均分对比 -->
      <view class="chart-section">
        <text class="section-title">班级平均分对比</text>
        <view class="chart-container">
          <view v-for="(item, index) in comparisonData.classAverages" :key="index" class="bar-item">
            <view class="bar-label">{{ item.class_name }}</view>
            <view class="bar-wrapper">
              <view class="bar" :style="{ width: (item.average_score / maxAverage * 100) + '%' }">
                <text class="bar-value">{{ Math.round(item.average_score * 10) / 10 }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 及格率对比 -->
      <view class="chart-section">
        <text class="section-title">班级及格率对比</text>
        <view class="chart-container">
          <view v-for="(item, index) in comparisonData.classPassRates" :key="index" class="bar-item">
            <view class="bar-label">{{ item.class_name }}</view>
            <view class="bar-wrapper">
              <view class="bar pass-bar" :style="{ width: item.pass_rate + '%' }">
                <text class="bar-value">{{ Math.round(item.pass_rate * 10) / 10 }}%</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 优秀率对比 -->
      <view class="chart-section">
        <text class="section-title">班级优秀率对比</text>
        <view class="chart-container">
          <view v-for="(item, index) in comparisonData.classExcellentRates" :key="index" class="bar-item">
            <view class="bar-label">{{ item.class_name }}</view>
            <view class="bar-wrapper">
              <view class="bar excellent-bar" :style="{ width: item.excellent_rate + '%' }">
                <text class="bar-value">{{ Math.round(item.excellent_rate * 10) / 10 }}%</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ClassComparisonChart',
  props: {
    comparisonData: {
      type: Object,
      default: () => ({
        classAverages: [],
        classPassRates: [],
        classExcellentRates: []
      })
    }
  },
  computed: {
    maxAverage() {
      if (!this.comparisonData.classAverages.length) return 100;
      return Math.max(...this.comparisonData.classAverages.map(item => item.average_score));
    }
  }
};
</script>

<style scoped>
.class-comparison {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.comparison-header {
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

.comparison-charts {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-section {
  background: #f8f9fb;
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 20px;
  display: block;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-label {
  width: 80px;
  font-size: 14px;
  color: #606266;
  text-align: right;
}

.bar-wrapper {
  flex: 1;
  height: 24px;
  background: #ebeef5;
  border-radius: 12px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #409EFF;
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  transition: width 0.3s ease;
  min-width: 40px;
}

.pass-bar {
  background: #67c23a;
}

.excellent-bar {
  background: #e6a23c;
}

.bar-value {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .bar-label {
    width: 60px;
    font-size: 12px;
  }
  
  .bar-wrapper {
    height: 20px;
  }
  
  .bar {
    padding: 0 8px;
  }
}
</style>
