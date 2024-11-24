<template>
  <view class="container">
    <view class="avatar">
      <image :src="user.avatar" @tap="chooseImage"></image>
    </view>
    <view class="nickname">
      <text class="nickname-text" @click="stuInfo.name = true">{{
        student.name
      }}</text>
    </view>
    <el-dialog title="姓名" :visible.sync="stuInfo.name">
      <el-input v-model="student.name" placeholder="请输姓名"></el-input>
    </el-dialog>
    <view class="info">
      <view class="item">
        <text class="item-title">学号</text>
        <text class="item-value">{{ student.id }}</text>
      </view>

      <view class="item" @click="stuInfo.gender = true">
        <text class="item-title">性别</text>
        <text class="item-value">{{ student.gender }}</text>
      </view>
      <el-dialog title="性别" :visible.sync="stuInfo.gender">
        <el-radio-group v-model="student.gender">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-dialog>
      <view class="item">
        <text class="item-title">年级</text>
        <text class="item-value">{{ student.grade }}</text>
      </view>
      <view class="item">
        <text class="item-title">班级</text>
        <text class="item-value">{{ student.classId }}</text>
      </view>
      <view class="item" v-if="student.major">
        <text class="item-title">专业</text>
        <text class="item-value">{{ student.major }}</text>
      </view>
      <view class="item" @click="stuInfo.password = true">
        <text class="item-title">密码</text>
        <text class="item-value">{{ student.password }}</text>
      </view>
      <el-dialog title="密码" :visible.sync="stuInfo.password">
        <el-input v-model="student.password" placeholder="请输密码"></el-input>
      </el-dialog>
      <view class="item" @click="stuInfo.birthday = true">
        <text class="item-title">生日</text>
        <text class="item-value">{{ student.birthday }}</text>
      </view>
      <el-dialog title="生日" :visible.sync="stuInfo.birthday">
        <view>
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="student.birthday"
            style="width: 100%"
          ></el-date-picker>
        </view>
      </el-dialog>
      <view class="item" @click="stuInfo.email = true">
        <text class="item-title">邮箱</text>
        <text class="item-value">{{ student.email }}</text>
      </view>
      <el-dialog title="邮箱" :visible.sync="stuInfo.email">
        <el-input v-model="student.email" placeholder="请输邮箱"></el-input>
      </el-dialog>
      <view class="item" @click="stuInfo.phone = true">
        <text class="item-title">电话</text>
        <text class="item-value">{{ student.phone }}</text>
      </view>
      <el-dialog title="电话" :visible.sync="stuInfo.phone">
        <el-input v-model="student.phone" placeholder="请输电话"></el-input>
      </el-dialog>
      <view class="item" @click="stuInfo.address = true">
        <text class="item-title">地址</text>
        <text class="item-value">{{ student.address }}</text>
      </view>
      <el-dialog title="地址" :visible.sync="stuInfo.address">
        <el-input v-model="student.address" placeholder="请输地址"></el-input>
      </el-dialog>
    </view>
    <view class="modify">
      <el-button type="danger" class="modify-btn" @click="logOut"
        >退出</el-button
      >
      <el-button type="success" class="modify-btn" @click="save"
        >保存</el-button
      >
    </view>
  </view>
</template>

<script>
import moment from "moment";
import { updataUser } from "@/api/user";
import { getStuByRoleId,updatastudent } from "@/api/student";
export default {
  data() {
    return {
      imageUrl:"",
      user: {},
      student: {},
      stuInfo: {
        name: false,
        password: false,
        birthday: false,
        email: false,
        phone: false,
        address: false,
        gender: false,
      },
    };
  },
  mounted() {
    this.user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : {};
    this.getStudentInfo();
  },
  methods: {
    chooseImage() {
    // 调用uni.chooseImage API选择图片
    uni.chooseImage({
      count: 1, // 默认9，设置图片的数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定图片的临时文件路径列表
        this.imageUrl = res.tempFilePaths[0];
        this.uploadImage(); // 上传图片
      }
    });
  },
  uploadImage() {
    // 调用uni.uploadFile API上传图片
    uni.uploadFile({
      url: 'http://localhost:9001/sms/file/upload', // 服务器URL地址
      filePath: this.imageUrl, // 需要上传的文件路径
      name: 'file', // 文件对应的 key，开发者在服务器端通过这个 key 可以获取到文件二进制内容
      formData: {
        'user': 'test' // 其他额外的表单数据
      },
      success: res => {
        // 上传成功后的回调函数
        var obj = JSON.parse(res.data);
        this.user.avatar = obj.data;
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    });
  },

    goModifyPage() {
      uni.navigateTo({
        url: "/pages/modify-info/modify-info",
      });
    },
    async getStudentInfo() {
      const res = await getStuByRoleId(this.user.roleId);
      if (res.code == 200) {
        this.student = res.data;
      }
    },
    async save() {
      this.student.birthday = moment(this.student.birthday).add(1, "day");
      const res = await updatastudent(this.student)
      if(res.code == 200) {
        const res1 = await updataUser(this.user);
        if(res1.code == 200) {
          uni.showToast({
          title: "修改成功",
          icon: "success",
        });
        }
      }
    },
    logOut() {
      uni.navigateTo({
        url: "/pages/login/login",
      });
      localStorage.removeItem("user");
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 20px 0;
}

.avatar image {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  border: 4px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.avatar image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.nickname {
  text-align: center;
  margin-bottom: 30px;
}

.nickname-text {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.info {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.item:last-child {
  border-bottom: none;
}

.item:hover {
  background-color: #f8f9fb;
  transform: translateX(5px);
}

.item-title {
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.item-value {
  color: #303133;
  font-size: 16px;
}

.modify {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.modify-btn {
  width: 45%;
  height: 40px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.modify-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Dialog样式优化 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: #f5f7fa;
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-dialog__body) {
  padding: 30px 20px;
}

:deep(.el-input__inner) {
  border-radius: 8px;
}

:deep(.el-radio) {
  margin-right: 20px;
}

:deep(.el-button) {
  border-radius: 8px;
}
</style>
