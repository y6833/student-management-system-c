<template>
  <view>
    <view class="basicInfo">
      <view class="basicInfoRight">
        <view
          class="grade_bar"
          v-for="(item, index) in subRankList"
          :key="index"
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
	  <div class="proposal">评语：{{proposal}}</div>
    </view>
  </view>
</template>

<script>
import { getSubRank ,getProposal} from "@/api/scores";
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
	  proposal:""
    };
  },
  mounted() {
    this.getSubRank();
	this.getProposal()
  },
  onLoad(options) {
    this.examValue = options.exam;
    this.studentValue = options.studentId;
  },
  methods: {
	async getProposal(){
		const params = {
        examValue: this.examValue,
        studentValue: this.studentValue,
      };
      const res = await getProposal(params);
      if (res.code == 200) {
		console.log(res.data);
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
  },
};
</script>

<style>
.basicInfo {
  height: 400px;
  line-height: 40px;
  font-size: 14px;
  background-color: #fff;
}
.grade_bar {
  padding: 5px 15px;
  margin-bottom: 10px;
  background-color: #f5f9fc;
  width: 93%;
  display: flex;
  justify-content: space-between;
}
.gradeBar_Name {
  color: #8c9abb;
  margin-right: 10px;
}
</style>
