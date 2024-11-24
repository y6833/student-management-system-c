<template>
  <div class="login-container">
    <el-form
      :rules="rules"
      :model="user"
      class="login-content"
      shadow="hover"
      ref="userForm"
    >
      <h2>欢迎登录</h2>
      <el-form-item prop="username">
        <el-input
          type="text"
          placeholder="用户名"
          v-model="user.username"
          class="login-input"
          prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="密码"
          v-model="user.password"
          class="login-input"
          prefix-icon="el-icon-lock"
          @keyup.enter.native="login"
        ></el-input>
      </el-form-item>
      <el-button @click="login" type="primary" class="login-button"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import request from "../../utils/request";
import {loginInfo} from '@/api/login'
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 1, max: 16, message: "用户名长度在6-16之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6-16之间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs["userForm"].validate(async (valid) => {
        if (valid) {
          //表单校验合法
          // 假设在这里进行登录验证
          if (this.user.username == "") {
            this.$message.error("用户名不能为空");
          } else if (this.user.password == "") {
            this.$message.error("密码不能为空");
          } else {
            const res = await loginInfo(this.user)
            if (res.code == 200) {
              localStorage.setItem("user", JSON.stringify(res.data)); //将用户信息存入浏览器
                this.$router.push("../../pages/index/index");
                this.$message.success("登录成功");
              } else {
                this.$message.error(res.msg);
              }

          }
        }
      });
    },
  },
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  z-index: 0;
  background: url("/static/login/login.jpg") center center;
  background-size: cover;
  animation: rotate 30s linear infinite;
  opacity: 0.1;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-content {
  position: relative;
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  transform: translateY(0);
  transition: all 0.3s ease;
}

.login-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

h2 {
  color: #303133;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.el-input__inner) {
  height: 45px;
  line-height: 45px;
  border-radius: 25px;
  background: #f5f7fa;
  border: 2px solid transparent;
  padding-left: 45px;
  transition: all 0.3s ease;
}

:deep(.el-input__inner:focus) {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

:deep(.el-input__prefix) {
  left: 15px;
}

:deep(.el-form-item) {
  margin-bottom: 25px;
}

:deep(.el-form-item__error) {
  padding-left: 15px;
}

.login-button {
  width: 100%;
  height: 45px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(1px);
}

:deep(.el-message) {
  min-width: 300px;
  padding: 15px 20px;
  border-radius: 10px;
}

:deep(.el-message--success) {
  background: #f0f9eb;
  border-color: #e1f3d8;
}

:deep(.el-message--error) {
  background: #fef0f0;
  border-color: #fde2e2;
}

:deep(.el-message__content) {
  font-size: 14px;
  line-height: 1;
}

@media (max-width: 480px) {
  .login-content {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>