<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>管理后台登录</h2>
      </template>
      <el-form :model="form" @submit.prevent="handleLogin">
        <el-form-item label="账号">
          <el-input v-model="form.email" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    ElMessage.error('请输入账号和密码');
    return;
  }
  
  loading.value = true;
  try {
    await userStore.login(form.value.email, form.value.password);
    ElMessage.success('登录成功');
    router.push('/dashboard');
  } catch (error: any) {
    console.error('登录失败:', error);
    ElMessage.error(error.message || '登录失败，请检查账号密码');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
}

.el-button {
  width: 100%;
  margin-top: 20px;
}
</style> 