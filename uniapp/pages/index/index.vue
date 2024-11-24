<template>
  <view class="content">
    <view class="header">
      <view class="semester-select">
        <el-select
          v-model="semester"
          placeholder="学期"
          size="mini"
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
      <view class="user-container">
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
      </view>
    </view>
    <view class="triangle"> </view>
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
          <view class="examList_item" v-for="(item, index) in examList" :key="index">
            <view class="course_name">{{ item.courseName }}</view>
            <view class="exam_info">
              <view class="exam_info_item">
                <text class="exam_info_label">考试名称</text>
                <text class="exam_info_value">{{ item.examName }}</text>
              </view>
            </view>
            <view class="exam_time">
              <text class="exam_time_icon">📅</text>
              <text class="exam_time_text">{{ item.examDate }}</text>
            </view>
            <view class="exam_location">
              <text class="exam_location_icon">📍</text>
              <text class="exam_location_text">{{ item.examLocation || '暂无地点信息' }}</text>
            </view>
            <view class="exam_actions">
              <el-button type="text" size="small" @click="gotoScires(item.examName,item.id)">查看详情</el-button>
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
        console.log('this.examList',this.examList);
        
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
    gotoScires(examName,id) {
      // index.vue
      uni.navigateTo({
        url: `/pages/scores_student/scores_student?exam=${examName}&examId=${id}&studentId=${this.user.roleId}`,
      });
    },
  },
};
</script>

<style>
.content {
  padding: 15px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
  border-radius: 15px;
  margin-bottom: 20px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.semester-select {
  margin-bottom: 20px;
  width: 160px;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

:deep(.semester-select .el-input__inner) {
  background: transparent;
  border: none;
  color: #fff;
  text-align: center;
  font-size: 15px;
}

:deep(.semester-select .el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.semester-select .el-select .el-input .el-select__caret) {
  color: #fff;
}

.user-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.userInfo {
  color: #fff;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.userInfo p {
  margin: 0;
  font-size: 15px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.avatar {
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar_img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #fff;
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
  gap: 10px;
  padding: 8px;
  background: #f8f9fb;
  border-radius: 8px;
}

.option {
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s ease;
  color: #606266;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.optionHover {
  background: #409EFF;
  color: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.exam-select {
  margin-bottom: 20px;
}

.examList_body {
  padding: 10px;
}

.examList_item {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 1px solid #ebeef5;
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
}

.examList_item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #409EFF, #667eea);
  border-radius: 2px;
}

.examList_item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.course_name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
  padding-left: 12px;
}

.exam_info {
  background: #f8f9fb;
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 15px;
}

.exam_info_item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.exam_info_item:last-child {
  margin-bottom: 0;
}

.exam_info_label {
  color: #909399;
  font-size: 14px;
  margin-right: 8px;
  min-width: 70px;
}

.exam_info_value {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.exam_time {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  background: #f0f7ff;
  padding: 10px 15px;
  border-radius: 8px;
}

.exam_time_icon {
  color: #409EFF;
  font-size: 16px;
}

.exam_time_text {
  color: #409EFF;
  font-size: 14px;
  font-weight: 500;
}

.exam_location {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: #f8f9fb;
  border-radius: 8px;
  margin-bottom: 15px;
}

.exam_location_icon {
  color: #909399;
  font-size: 16px;
}

.exam_location_text {
  color: #606266;
  font-size: 14px;
}

.exam_actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f0f2f5;
}

/* 课表样式 */
.schedule_table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 8px;
  overflow-x: auto;
  display: block;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.schedule_table thead {
  background: #f5f7fa;
}

.schedule_table th {
  background: #f5f7fa;
  padding: 12px;
  font-weight: 500;
  color: #606266;
  border: 1px solid #ebeef5;
  min-width: 80px;
  position: sticky;
  top: 0;
  z-index: 1;
}

.schedule_table th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  background: #f5f7fa;
}

.schedule_table td {
  padding: 12px 8px;
  border: 1px solid #ebeef5;
  text-align: center;
  vertical-align: middle;
  color: #606266;
  min-width: 80px;
  max-width: 120px;
  word-break: break-word;
  white-space: normal;
}

.schedule_table td:first-child {
  position: sticky;
  left: 0;
  background: #f5f7fa;
  z-index: 1;
  font-weight: 500;
}

.schedule_td {
  height: 60px;
  background: #fff;
}

.schedule_td:hover {
  background: #f5f7fa;
}

/* 课表容器样式 */
.semester_schedule {
  margin-top: 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 周数选择器样式 */
.No_week {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fb;
  border-radius: 8px;
}

.No_week_centent {
  margin: 0 20px;
  font-size: 15px;
  color: #303133;
  font-weight: 500;
}

.reduce, .plus {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: #409EFF;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reduce::before, .plus::before, .plus::after {
  content: '';
  position: absolute;
  background: #fff;
}

.reduce::before {
  width: 12px;
  height: 2px;
}

.plus::before {
  width: 12px;
  height: 2px;
}

.plus::after {
  width: 2px;
  height: 12px;
}

:deep(.el-button--text) {
  padding: 4px 8px;
  font-size: 14px;
}

@media screen and (max-width: 768px) {
  .schedule_table th,
  .schedule_table td {
    padding: 8px 6px;
    font-size: 13px;
  }

  .No_week {
    padding: 8px;
  }

  .No_week_centent {
    font-size: 14px;
  }

  .reduce, .plus {
    width: 24px;
    height: 24px;
  }

  .examList_body {
    padding: 10px;
  }

  .examList_item {
    padding: 15px;
    margin-bottom: 12px;
  }

  .course_name {
    font-size: 16px;
    margin-bottom: 12px;
  }

  .exam_info {
    padding: 10px;
  }

  .exam_info_label {
    font-size: 13px;
    min-width: 60px;
  }

  .exam_info_value {
    font-size: 13px;
  }

  .exam_time, .exam_location {
    padding: 8px 12px;
  }
}
</style>