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
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  height: 150px;
  background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
  border-radius: 15px;
  margin-bottom: 20px;
  position: relative;
}

.semester-select {
  position: absolute;
  top: 20px;
  right: 20px;
}

.userInfo {
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  color: #fff;
  z-index: 1;
}

.userInfo p {
  margin: 8px 0;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.avatar {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: translateY(-50%) scale(1.05);
}

.avatar_img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.body_content {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.choiceMune {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.option {
  padding: 10px 30px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s ease;
  color: #606266;
}

.optionHover {
  background: #409EFF;
  color: #fff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.exam-select {
  margin-bottom: 20px;
}

.examList_body {
  max-height: 500px;
  overflow-y: auto;
}

.examList_item {
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background: #f8f9fb;
  transition: all 0.3s ease;
}

.examList_item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.examList_item_title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

.examList_item_time {
  color: #909399;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goto {
  cursor: pointer;
  background: #409EFF;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.goto:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 课表样式 */
.No_week {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.No_week_centent {
  margin: 0 20px;
  font-size: 16px;
  color: #303133;
}

.reduce, .plus {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: #409EFF;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.reduce:hover, .plus:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.reduce::before, .plus::before, .plus::after {
  content: '';
  position: absolute;
  background: #fff;
}

.reduce::before {
  width: 12px;
  height: 2px;
  top: 11px;
  left: 6px;
}

.plus::before {
  width: 12px;
  height: 2px;
  top: 11px;
  left: 6px;
}

.plus::after {
  width: 2px;
  height: 12px;
  top: 6px;
  left: 11px;
}

.schedule_table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.schedule_table th {
  background: #f5f7fa;
  padding: 12px;
  font-weight: 500;
  color: #606266;
  border: 1px solid #ebeef5;
}

.schedule_table td {
  padding: 12px;
  border: 1px solid #ebeef5;
  text-align: center;
  vertical-align: middle;
  color: #606266;
  min-width: 100px;
}

.schedule_td {
  height: 60px;
}

:deep(.el-button--text) {
  color: #409EFF;
  font-weight: 500;
}

:deep(.el-button--text:hover) {
  color: #66b1ff;
}

:deep(.el-select) {
  width: 120px;
}

:deep(.el-select .el-input__inner) {
  border-radius: 20px;
}

:deep(.el-message-box) {
  border-radius: 12px;
}

:deep(.el-message-box__header) {
  padding: 15px 20px;
  background: #f5f7fa;
}

:deep(.el-message-box__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-message-box__content) {
  padding: 20px;
  color: #606266;
}

:deep(.el-message-box__btns) {
  padding: 10px 20px 20px;
}

:deep(.el-button) {
  border-radius: 20px;
}
</style>