<template>
  <view class="content">
    <view class="header"> </view>
    <!-- 考试选择 -->
    <view class="semester-select">
      <el-select
        v-model="semester"
        placeholder="学期"
        size="mini"
        style="padding: 6px; width: 100px"
        @change="choiceSchedule"
      >
        <el-option
          v-for="item in semesterList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </view>

    <view class="triangle"> </view>
    <view class="userInfo">
      <p>姓名：{{ student.name }}</p>
      <p>年级：{{ student.grade }}</p>
      <p>班级：{{ student.classId }}</p>
      <p v-if="student.major" style="width: 220px">专业：{{ student.major }}</p>
    </view>
    <view class="avatar" @click="gotoUserInfo">
      <image
        class="avatar_img"
        :src="user.avatar"
        mode="aspectFit|aspectFill|widthFix"
        lazy-load="false"
        binderror=""
        bindload=""
      />
    </view>

    <view class="body_content">
      <view class="choiceMune">
        <view
          class="option"
          :class="mnueOption == 1 ? 'optionHover' : ''"
          @click="mnueOption = 1"
          >历史考试</view
        >
        <view
          class="option"
          :class="mnueOption == 2 ? 'optionHover' : ''"
          @click="getscheduleWorkListFunc"
          >学期课表</view
        >
      </view>
      <view class="history_exam" v-if="mnueOption == 1">
        <view class="exam-select">
          <el-select
            v-model="examType"
            placeholder="考试类型"
            size="mini"
            style="padding: 6px; width: 90px"
            @change="changeExamType"
          >
            <el-option
              v-for="item in examTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </view>
        <view class="examList_body">
          <view class="examList_item" v-for="item in examList" :key="item.id">
            <view class="examList_item_title">
              考试名称：{{ item.examName }}
            </view>
            <view class="examList_item_time">
              考试时间：{{ item.examDate }}
              <span class="goto" @click="gotoScires(item.examName)"> > </span>
            </view>
          </view>
        </view>
      </view>
      <view class="semester_schedule" v-if="mnueOption == 2">
        <view class="No_week">
          <view class="reduce" @click="reduceNoWeek"></view>
          <view class="No_week_centent">第{{ noWeek }}周</view>
          <view class="plus" @click="plusNoWeek"></view>
        </view>
        <table class="schedule_table">
          <thead>
            <tr>
              <th>时间</th>
              <th>周一</th>
              <th>周二</th>
              <th>周三</th>
              <th>周四</th>
              <th>周五</th>
              <th>周六</th>
              <th>周天</th>
            </tr>
          </thead>
          <tbody>
            <!-- 课次 -->
            <tr v-for="n in 8" :key="n">
              <td style="width: 10px; text-align: center">第{{ n }}节课</td>
              <td v-for="m in 7" :key="m" class="schedule_td">
                <div v-for="(item, index) in scheduleList" :key="index">
                  <div
                    v-if="
                      item.week == m &&
                      item.section == n &&
                      item.weekly.includes(noWeek)
                    "
                    style="margin-bottom: 10px"
                  >
                    <el-button type="text" @click="open(item)">{{
                      item.course
                    }}</el-button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </view>
      <!-- 历史考试 -->
    </view>
  </view>
</template>

<script>
import { getscheduleWorkListByStudentId } from "@/api/schedule";
import { getStuByRoleId } from "@/api/student";
import { getExamListByExamTypeAndSemesterAndReleId } from "@/api/examination";
export default {
  data() {
    return {
      mnueOption: 1,
      examList: [],
      semester: 1, //学期
      noWeek: 1,
      scheduleList: [],
      semesterList: [
        {
          value: 1,
          label: "第一学期",
        },
        {
          value: 2,
          label: "第二学期",
        },
      ],
      examType: 1, //考试类型
      examTypeList: [
        {
          value: 1,
          label: "考试",
        },
        {
          value: 2,
          label: "测试",
        },
      ],
      title: "Hello",
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {},
      student: {},
    };
  },
  onLoad() {},
  mounted() {
    this.user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};
    this.getStudentByReleId();
    this.changeExamType();
  },
  methods: {
    plusNoWeek() {
      if (this.noWeek < 20) {
        this.noWeek += 1;
      }
    },
    reduceNoWeek() {
      if (this.noWeek > 1) {
        this.noWeek -= 1;
      }
    },
    open(item) {
      const h = this.$createElement;
      this.$msgbox({
        title: "课程信息",
        message: h("p", null, [
          h("p", null, "课程名称：" + item.course),
          h("p", null, "课程周次：" + item.weekly),
          h("p", null, "课程节次：第" + item.section + "节"),
          h("p", null, "教室：" + item.classroom),
          h("p", null, "教师：" + item.teacher),
          h("p", null, "考试类型：" + (item.type == 1 ? "考试" : "考察")),
        ]),
      });
    },
    choiceSchedule() {
      this.changeExamType();
      this.getscheduleWorkList();
    },
    getscheduleWorkListFunc() {
      this.getscheduleWorkList();
      this.mnueOption = 2;
    },
    //获取课表内容
    async getscheduleWorkList() {
      this.scheduleList = [];
      const params = {
        semester: this.semester,
        releId: this.user.roleId,
      };
      // 在这里编写你的扩展按钮触发的方法逻辑
      const res = await getscheduleWorkListByStudentId(params);
      if (res.code == 200) {
        this.scheduleList = res.data;
      }
    },
    //选择考试类型获得考试列表
    async changeExamType() {
      const params = {
        examType: this.examType,
        semester: this.semester,
        releId: this.user.roleId,
      };
      const res = await getExamListByExamTypeAndSemesterAndReleId(params);
      if (res.code == 200) {
        this.examList = res.data;
      }
    },
    //通过releId获取学生的信息
    async getStudentByReleId() {
      const res = await getStuByRoleId(this.user.roleId);
      if (res.code == 200) {
        this.student = res.data;
      }
    },
    gotoUserInfo() {
      // this.$router.push("../../pages/person/person");
      uni.navigateTo({
        url: "/pages/person/person",
      });
    },
    gotoScires(examName) {
      // index.vue
      uni.navigateTo({
        url: `/pages/scores_student/scores_student?exam=${examName}&studentId=${this.user.roleId}`,
      });
    },
  },
};
</script>

<style>
.content {
  position: relative;
}
.header {
  background-color: #010;
  width: 100%;
  height: 300px;
}
.avatar {
  position: absolute;
  top: 90px;
  right: 60px;
  background-color: #010;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar_img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background-color: #fff;
  overflow: hidden;
}
.triangle {
  position: absolute;
  top: 0px;
  left: -150px;
  width: 0;
  height: 0;
  border-left: 300px solid transparent;
  border-right: 300px solid transparent;
  border-bottom: 300px solid #5efce8;
  transform: rotate(90deg);
}

.body_content {
  position: absolute;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  min-height: 200px;
  width: 100%;
  background-color: #fff;
  top: 250px;
}
.userInfo {
  position: absolute;
  top: 80px;
  left: 20px;
  font-family: 华文新魏;
  font-size: 20px;
  line-height: 30px;
}
.semester-select {
  position: absolute;
  top: 10px;
  left: 130px;
  z-index: 10;
  min-width: 150px;
  height: 40px;
  background-color: #fff;
  opacity: 0.8;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .el-select .el-input__inner {
  font-size: 14px;
  border: 0;
}
.choiceMune {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
  border-bottom: 1px solid #8080804f;
}
.option {
  width: 50%;
  height: 40px;
  background-color: #fff;
  opacity: 0.8;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .option:hover {
  background-color: #5efce8;
  color: #fff;
} */
.optionHover {
  background-color: #5efce8;
  color: #fff;
}
.examList_item {
  margin: 10px 0;
  width: 100%;
  height: 40px;
  background-color: #5efce8;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
}
.examList_item_title {
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 180px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  margin-left: 10px;
  font-size: 16px;
}
.examList_item_time {
  margin-right: 5px;
  font-size: 16px;
}
.goto {
  font-size: 20px;
  margin: 0 16px;
}
.LookStudent {
  color: #000;
  text-decoration: none;
}
.schedule_table {
  width: 100%;
  border-collapse: collapse;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.schedule_td {
  height: 60px;
}
.No_week {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  margin: 10px 0;
}
.plus {
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 20px solid #5efce8;
  margin-right: 50px;
}
.reduce {
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 20px solid #5efce8;
  margin-left: 50px;
  width: 0;
  height: 0;
}
</style>