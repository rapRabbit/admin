<template>
  <div class="orders">
    <div class="header">
      <h2>订单管理</h2>
      <el-select v-model="statusFilter" placeholder="订单状态" clearable>
        <el-option
          v-for="status in orderStatuses"
          :key="status.value"
          :label="status.label"
          :value="status.value"
        />
      </el-select>
    </div>

    <el-table :data="filteredOrders" v-loading="loading">
      <el-table-column prop="_id" label="订单号" width="220" />
      <el-table-column prop="user" label="用户" />
      <el-table-column prop="totalAmount" label="金额">
        <template #default="{ row }">
          ¥{{ row.totalAmount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleView(row)">查看</el-button>
            <el-button 
              v-if="row.status === 'paid'"
              type="success" 
              @click="handleShip(row)"
            >
              发货
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="'订单详情 #' + currentOrder?._id"
      width="60%"
    >
      <template v-if="currentOrder">
        <el-descriptions border>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ getStatusLabel(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付金额">
            ¥{{ currentOrder.totalAmount.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ new Date(currentOrder.createdAt).toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>收货信息</el-divider>
        <el-descriptions border>
          <el-descriptions-item label="收货人">
            {{ currentOrder.shippingAddress.name }}
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">
            {{ currentOrder.shippingAddress.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="收货地址">
            {{ formatAddress(currentOrder.shippingAddress) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>商品信息</el-divider>
        <el-table :data="currentOrder.items" border>
          <el-table-column prop="product.name" label="商品名称" />
          <el-table-column prop="price" label="单价">
            <template #default="{ row }">
              ¥{{ row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100" />
          <el-table-column label="小计" width="150">
            <template #default="{ row }">
              ¥{{ (row.price * row.quantity).toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { orderApi } from '@/api';

interface Address {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface OrderItem {
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: Address;
  createdAt: string;
}

const orders = ref<Order[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const currentOrder = ref<Order | null>(null);
const statusFilter = ref('');

const orderStatuses = [
  { value: 'pending', label: '待付款', type: 'warning' },
  { value: 'paid', label: '已付款', type: 'success' },
  { value: 'shipped', label: '已发货', type: 'primary' },
  { value: 'delivered', label: '已送达', type: 'info' },
  { value: 'completed', label: '已完成', type: 'success' },
  { value: 'cancelled', label: '已取消', type: 'danger' }
];

const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value;
  return orders.value.filter(order => order.status === statusFilter.value);
});

const getStatusLabel = (status: string) => {
  const found = orderStatuses.find(s => s.value === status);
  return found ? found.label : status;
};

const getStatusType = (status: string): 'warning' | 'success' | 'primary' | 'info' | 'danger' => {
  const found = orderStatuses.find(s => s.value === status);
  return found ? found.type as 'warning' | 'success' | 'primary' | 'info' | 'danger' : 'info';
};

const formatAddress = (address: Address) => {
  return `${address.street}, ${address.city}, ${address.state}, ${address.country} ${address.zipCode}`;
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const { data } = await orderApi.list({});
    orders.value = data;
  } catch (error) {
    ElMessage.error('获取订单列表失败');
  } finally {
    loading.value = false;
  }
};

const handleView = async (order: Order) => {
  try {
    const { data } = await orderApi.detail(order._id);
    currentOrder.value = data;
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取订单详情失败');
  }
};

const handleShip = async (order: Order) => {
  try {
    await orderApi.update(order._id, { status: 'shipped' });
    ElMessage.success('订单已发货');
    fetchOrders();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
.orders {
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
</style> 