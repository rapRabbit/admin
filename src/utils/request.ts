import axios from 'axios'
import { ElMessage } from 'element-plus'

// 强制使用生产环境 API 的调试开关
const FORCE_PROD_API = false; // 设置为 false 以允许系统根据环境自动切换 API 地址

// 检测当前环境
const isProd = 
  FORCE_PROD_API ||
  import.meta.env.MODE === 'production' || 
  import.meta.env.PROD || 
  window.location.hostname === '34.80.16.115' ||
  window.location.hostname.includes('preview');

// 根据环境使用不同的基础URL
const baseURL = isProd
  ? 'http://34.80.16.115/api'
  : '/api'

console.log('当前环境:', import.meta.env.MODE, '是否生产环境:', isProd);
console.log('API 基础地址:', baseURL);

const request = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据后端返回的状态码处理不同情况
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      
      // 处理特定错误码，如 401 未授权
      if (res.code === 401) {
        // 清除 token 并重定向到登录页
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  error => {
    console.error('响应错误', error)
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request
