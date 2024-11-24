<template>
  <view>
    <view class="basicInfo">
      <h2>考试名称：{{ examValue }}</h2>
      <view class="basicInfoRight">
        <view
          class="grade_bar"
          v-for="(item, index) in subRankList"
          :key="index"
          @tap="goToExamDetails(item)"
          :class="{ 'clickable': item.course !== '总分' }"
        >
          <view>
            <span class="gradeBar_Name">{{ item.course }}</span>
            <span class="gradeBar_score">{{ item.subject }}</span>
          </view>
          <view>
            <span class="gradeBar_Name">班级排名</span>
            <span class="gradeBar_ClassRanking">{{ item.classRangk }}</span>
          </view>
          <view>
            <span class="gradeBar_Name">年级排名</span>
            <span class="gradeBar_GradeRanking">{{ item.gradeRangk }}</span>
          </view>
        </view>
      </view>
      <view class="Chartbar">
        <StudentRadarChart
          class="chart"
          :subRankList="subRankList"
          :examValue="examValue"
        />
      </view>
      <div class="proposal-section">
        <div class="proposal-title">
          <i class="proposal-icon"></i>
          教师评语
        </div>
        <div class="proposal-content">
          {{ proposal }}
        </div>
      </div>
    </view>
  </view>
</template>

<script>
import { getSubRank, getProposal } from "@/api/scores";
import StudentRadarChart from "@/components/fig/StudentRadarChart.vue";
export default {
  components: {
    StudentRadarChart,
  },
  data() {
    return {
      subRankList: [],
      examValue: "", //考试名称
      studentValue: "", //学生id
      proposal: "",
    };
  },
  mounted() {
    this.getSubRank();
    this.getProposal();
  },
  onLoad(options) {
    this.examValue = options.exam;
    this.examId = options.examId;
    this.studentValue = options.studentId;
  },
  methods: {
    async getProposal() {
      const params = {
        examValue: this.examValue,
        studentValue: this.studentValue,
      };
      const res = await getProposal(params);
      if (res.code == 200) {
        this.proposal = res.data;
      }
    },
    async getSubRank() {
      const params = {
        examValue: this.examValue,
        studentValue: this.studentValue,
      };
      const res = await getSubRank(params);
      if (res.code == 200) {
        this.subRankList = res.data;
      }
    },
    goToExamDetails(item) {
      if (item.course === '总分') return;
      console.log(item);
      
      uni.navigateTo({
        url: `/pages/exam_details/exam_details?examId=${encodeURIComponent(this.examId)}&subject=${encodeURIComponent(item.course)}&className=${encodeURIComponent(item.className)}&studentId=${encodeURIComponent(this.studentValue)}`
      });
    }
  },
};
</script>

<style>
.basicInfo {
  padding: 25px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 20px;
  position: relative;
  overflow: hidden;
}

.basicInfo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409EFF, #667eea);
}

.basicInfo h2 {
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  position: relative;
}

.basicInfoRight {
  margin-bottom: 30px;
  display: grid;
  gap: 15px;
}

.grade_bar {
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
}

.grade_bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #409EFF, #667eea);
  border-radius: 2px;
}

.grade_bar.clickable {
  cursor: pointer;
}

.grade_bar.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: linear-gradient(to right, #ffffff, #f8f9fb);
}

.grade_bar.clickable:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.grade_bar view {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gradeBar_Name {
  color: #909399;
  font-size: 14px;
  font-weight: 500;
}

.gradeBar_score {
  color: #409EFF;
  font-size: 20px;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.gradeBar_ClassRanking,
.gradeBar_GradeRanking {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 18px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.Chartbar {
  margin: 30px 0;
  padding: 25px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
}

.Chartbar::before {
  content: '成绩分析';
  position: absolute;
  top: -12px;
  left: 20px;
  background: #409EFF;
  color: #fff;
  padding: 4px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.chart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

.proposal-section {
  margin-top: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: all 0.3s ease;
}

.proposal-title {
  padding: 16px 25px;
  background: linear-gradient(135deg, #409EFF 0%, #667eea 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.proposal-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: relative;
}

.proposal-icon::before,
.proposal-icon::after {
  content: '';
  position: absolute;
  background: #ffffff;
}

.proposal-icon::before {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  top: 4px;
  left: 4px;
}

.proposal-icon::after {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  bottom: 4px;
  right: 4px;
}

.proposal-content {
  padding: 25px;
  color: #606266;
  line-height: 1.8;
  font-size: 15px;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%);
}

.proposal-content::before {
  content: '"';
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 60px;
  color: rgba(64, 158, 255, 0.08);
  font-family: Georgia, serif;
  line-height: 1;
}

.proposal-content::after {
  content: '"';
  position: absolute;
  bottom: 0;
  right: 20px;
  font-size: 60px;
  color: rgba(64, 158, 255, 0.08);
  font-family: Georgia, serif;
  line-height: 1;
}

@media (max-width: 768px) {
  .basicInfo {
    margin: 15px;
    padding: 20px;
  }

  .basicInfo h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .grade_bar {
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .grade_bar view {
    width: 100%;
    justify-content: space-between;
  }

  .gradeBar_score,
  .gradeBar_ClassRanking,
  .gradeBar_GradeRanking {
    font-size: 16px;
  }

  .Chartbar {
    padding: 20px;
    margin: 25px 0;
  }

  .chart {
    height: 300px;
  }

  .proposal-section {
    margin-top: 25px;
  }

  .proposal-title {
    padding: 14px 20px;
    font-size: 15px;
  }

  .proposal-content {
    padding: 20px;
    font-size: 14px;
  }

  .proposal-content::before,
  .proposal-content::after {
    font-size: 48px;
  }
}
</style>
