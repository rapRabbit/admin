<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>总订单数</template>
          <div class="card-content">
            <el-statistic :value="statistics.orders" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>总用户数</template>
          <div class="card-content">
            <el-statistic :value="statistics.users" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>总商品数</template>
          <div class="card-content">
            <el-statistic :value="statistics.products" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <template #header>总销售额</template>
          <div class="card-content">
            <el-statistic :value="statistics.sales" prefix="¥" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statistics = ref({
  orders: 156,
  users: 2451,
  products: 89,
  sales: 45678.90
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card-content {
  text-align: center;
  padding: 20px 0;
}
</style> 