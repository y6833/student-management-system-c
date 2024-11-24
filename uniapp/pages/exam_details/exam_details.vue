<template>
  <view class="exam-details">
    <view class="header-section">
      <view class="header-info">
        <h2>{{ examInfo && examInfo.examName || '未知考试' }}</h2>
        <view class="subject-info">
          <text class="subject-name">{{ examInfo && examInfo.subjectName || '未知科目' }}</text>
          <text class="class-name">{{ examInfo && examInfo.className || '未知班级' }}</text>
        </view>
      </view>
      
      <view class="statistics-cards">
        <view class="stat-card" :class="{ 'loading': loading }">
          <text class="stat-label">个人得分</text>
          <text class="stat-value">{{ examInfo && examInfo.score || '暂无' }}</text>
        </view>
        <view class="stat-card" :class="{ 'loading': loading }">
          <text class="stat-label">班级排名</text>
          <text class="stat-value">{{ examInfo && examInfo.rank || '暂无' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getExamDetails } from '@/api/analysis'

export default {
  data() {
    return {
      examId: '',
      studentId: '',
      examInfo: null,
      loading: false,
      error: null
    }
  },
  
  async onLoad(options) {
    try {
      const examId = decodeURIComponent(options.examId || '');
      const subject = decodeURIComponent(options.subject || '');
      const studentId = decodeURIComponent(options.studentId || '');
      
      if (!examId || !studentId) {
        throw new Error('Missing required parameters: examId or studentId');
      }

      this.examId = examId;
      this.studentId = studentId;

      await this.fetchExamDetails();
    } catch (error) {
      console.error('Error in onLoad:', error);
      uni.showToast({
        title: error.message || '加载考试详情失败',
        icon: 'none',
        duration: 2000
      });
      setTimeout(() => {
        uni.navigateBack();
      }, 2000);
    }
  },
  
  methods: {
    async fetchExamDetails() {
      this.loading = true;
      this.error = null;
      
      try {
        uni.showLoading({
          title: '加载中...'
        });
        
        const examInfoRes = await getExamDetails(this.examId, this.studentId);
        if (examInfoRes.code === 200 && examInfoRes.data) {
          this.examInfo = examInfoRes.data;
        } else {
          throw new Error(examInfoRes.message || '获取考试信息失败');
        }
      } catch (error) {
        console.error('数据加载失败:', error);
        this.error = error.message || '数据加载失败，请重试';
        uni.showToast({
          title: this.error,
          icon: 'none',
          duration: 3000
        });
      } finally {
        this.loading = false;
        uni.hideLoading();
      }
    }
  }
};
</script>

<style>
.exam-details {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.header-info {
  margin-bottom: 20px;
}

.header-info h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

.subject-info {
  display: flex;
  gap: 15px;
  color: #606266;
  font-size: 14px;
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.stat-card {
  background-color: #f8f9fb;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card.loading {
  opacity: 0.7;
}

.stat-label {
  display: block;
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.error-message {
  color: #f56c6c;
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.loading-placeholder {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}
</style>
