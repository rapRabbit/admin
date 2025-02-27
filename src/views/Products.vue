<template>
  <div class="products">
    <div class="header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="handleAdd">添加商品</el-button>
    </div>

    <el-table :data="products" v-loading="loading">
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="price" label="价格">
        <template #default="{ row }">
          ¥{{ row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="isActive" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'danger'">
            {{ row.isActive ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button 
              :type="row.isActive ? 'danger' : 'success'"
              @click="handleToggleStatus(row)"
            >
              {{ row.isActive ? '下架' : '上架' }}
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="form.id ? '编辑商品' : '添加商品'"
      width="50%"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categories" multiple>
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  isActive: boolean;
}

const products = ref<Product[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const categories = ref(['电子产品', '服装', '食品', '图书']);

const form = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categories: [] as string[]
});

const fetchProducts = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get('/api/products');
    products.value = data;
  } catch (error) {
    ElMessage.error('获取商品列表失败');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  form.value = {
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categories: []
  };
  dialogVisible.value = true;
};

const handleEdit = (product: Product) => {
  form.value = { ...product };
  dialogVisible.value = true;
};

const handleSave = async () => {
  try {
    if (form.value._id) {
      
      await axios.put(`/api/products/${form.value._id}`, form.value);
      ElMessage.success('更新成功');
    } else {
      await axios.post('/api/products', form.value);
      ElMessage.success('添加成功');
    }
    dialogVisible.value = false;
    fetchProducts();
  } catch (error) {
    ElMessage.error(form.value.id ? '更新失败' : '添加失败');
  }
};

const handleToggleStatus = async (product: Product) => {
  console.debug(product)
  try {
    if (product.isActive) {
      await axios.put(`/api/products/${product._id}/deactivate`);
    } else {
      await axios.put(`/api/products/${product._id}/activate`);
    }
    ElMessage.success(product.isActive ? '下架成功' : '上架成功');
    fetchProducts();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};

onMounted(fetchProducts);
</script>

<style scoped>
.products {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}
</style> 