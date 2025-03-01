<template>
  <div class="users">
    <div class="header">
      <h2>用户管理</h2>
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户"
        prefix-icon="Search"
        clearable
        style="width: 300px"
      />
    </div>

    <el-table :data="filteredUsers" v-loading="loading">
      <el-table-column prop="_id" label="ID" width="100" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'danger'">
            {{ row.isActive ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册时间">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleView(row)">查看</el-button>
            <el-button 
              :type="row.isActive ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.isActive ? '禁用' : '启用' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="'用户详情'"
      width="50%"
    >
      <template v-if="currentUser">
        <el-descriptions border>
          <el-descriptions-item label="用户ID">
            {{ currentUser._id }}
          </el-descriptions-item>
          <el-descriptions-item label="用户名">
            {{ currentUser.name }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            {{ currentUser.email }}
          </el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag :type="currentUser.role === 'admin' ? 'danger' : 'info'">
              {{ currentUser.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentUser.isActive ? 'success' : 'danger'">
              {{ currentUser.isActive ? '正常' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ new Date(currentUser.createdAt).toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>订单统计</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>总订单数</template>
              <el-statistic :value="currentUser.stats?.totalOrders || 0" />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>总消费</template>
              <el-statistic 
                :value="currentUser.stats?.totalSpent || 0" 
                :precision="2"
                prefix="¥"
              />
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover">
              <template #header>最近订单</template>
              <div>{{ currentUser.stats?.lastOrderDate ? new Date(currentUser.stats.lastOrderDate).toLocaleDateString() : '无' }}</div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { userApi } from '@/api';

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  stats?: UserStats;
}

const users = ref<User[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const currentUser = ref<User | null>(null);
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  );
});

const fetchUsers = async () => {
  loading.value = true;
  try {
    const { data } = await userApi.list({});
    users.value = data;
  } catch (error) {
    ElMessage.error('获取用户列表失败');
  } finally {
    loading.value = false;
  }
};

const handleView = async (user: User) => {
  try {
    const { data } = await userApi.detail(user._id);
    currentUser.value = data;
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取用户详情失败');
  }
};

const handleToggleStatus = async (user: User) => {
  try {
    if (user.isActive) {
      await userApi.deactivate(user._id);
    } else {
      await userApi.activate(user._id);
    }
    ElMessage.success(user.isActive ? '禁用成功' : '启用成功');
    fetchUsers();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.users {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.el-divider {
  margin: 24px 0;
}

.el-descriptions {
  margin: 16px 0;
}

.el-card {
  text-align: center;
}
</style> 