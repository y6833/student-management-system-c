<template>
  <view class="progress-analysis">
    <view class="progress-header">
      <text class="title">成绩进步分析</text>
      <text class="subtitle">与上次考试相比</text>
    </view>
    
    <view class="progress-stats">
      <view class="stat-item">
        <text class="label">平均分提升</text>
        <text class="value" :class="{'positive': progressData.averageImprovement > 0, 'negative': progressData.averageImprovement < 0}">
          {{ progressData.averageImprovement > 0 ? '+' : '' }}{{ progressData.averageImprovement }}
        </text>
      </view>
      
      <view class="stat-item">
        <text class="label">进步人数</text>
        <text class="value">{{ progressData.improvedStudentCount }}人</text>
      </view>
      
      <view class="stat-item">
        <text class="label">进步率</text>
        <text class="value">{{ progressData.improvedRate }}%</text>
      </view>
      
      <view class="stat-item">
        <text class="label">最大进步</text>
        <text class="value positive">+{{ progressData.maxImprovement }}</text>
      </view>
    </view>
    
    <view class="top-improved">
      <text class="section-title">进步榜 TOP5</text>
      <view class="top-list">
        <view v-for="(student, index) in progressData.topImproved" :key="index" class="top-item">
          <view class="rank">{{ index + 1 }}</view>
          <view class="student-info">
            <text class="name">{{ student.student_name }}</text>
            <text class="scores">
              {{ student.previous_score }} → {{ student.current_score }}
              <text class="improvement positive">+{{ student.improvement }}</text>
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ScoreProgressAnalysis',
  props: {
    progressData: {
      type: Object,
      default: () => ({
        averageImprovement: 0,
        improvedStudentCount: 0,
        improvedRate: 0,
        maxImprovement: 0,
        topImproved: []
      })
    }
  }
};
</script>

<style scoped>
.progress-analysis {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.progress-header {
  margin-bottom: 30rpx;
  text-align: center;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #303133;
  display: block;
}

.subtitle {
  font-size: 24rpx;
  color: #909399;
  margin-top: 10rpx;
  display: block;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-item {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.label {
  font-size: 24rpx;
  color: #909399;
  margin-bottom: 10rpx;
  display: block;
}

.value {
  font-size: 36rpx;
  font-weight: bold;
  color: #303133;
}

.value.positive {
  color: #67c23a;
}

.value.negative {
  color: #f56c6c;
}

.top-improved {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-top: 20rpx;
}

.section-title {
  font-size: 28rpx;
  color: #606266;
  margin-bottom: 20rpx;
  display: block;
}

.top-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.top-item {
  display: flex;
  align-items: center;
  padding: 15rpx;
  background: #f8f9fa;
  border-radius: 8rpx;
  transition: all 0.3s;
}

.top-item:hover {
  background: #f0f2f5;
}

.rank {
  width: 40rpx;
  height: 40rpx;
  background: #409EFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 20rpx;
}

.top-item:nth-child(1) .rank {
  background: #f56c6c;
}

.top-item:nth-child(2) .rank {
  background: #e6a23c;
}

.top-item:nth-child(3) .rank {
  background: #67c23a;
}

.student-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-size: 28rpx;
  color: #303133;
}

.scores {
  font-size: 24rpx;
  color: #606266;
}

.improvement {
  margin-left: 10rpx;
  font-weight: bold;
}

.improvement.positive {
  color: #67c23a;
}

.improvement.negative {
  color: #f56c6c;
}

.no-data {
  text-align: center;
  padding: 40rpx;
  color: #909399;
  font-size: 28rpx;
}
</style>
