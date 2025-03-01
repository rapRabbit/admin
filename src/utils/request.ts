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

// 设置全局默认请求头
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const request = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    console.log('发送请求:', config.url, config.method, config.data);
    
    // 从 localStorage 获取 token，确保使用最新的 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 确保 Content-Type 正确设置
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json'
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
    console.log('收到响应:', response.config.url, response.status, response.data);
    const res = response.data
    
    // 如果响应直接是数据而不是包含code的对象，直接返回
    if (typeof res.code === 'undefined') {
      return res
    }
    
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
    console.error('响应错误', error);
    
    // 详细记录错误信息
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
      console.error('错误头信息:', error.response.headers);
      
      // 处理 401 错误
      if (error.response.status === 401) {
        ElMessage.error('登录失败：用户名或密码错误');
        // 不自动跳转到登录页，因为用户可能正在登录页
      } else {
        ElMessage.error(error.response.data?.message || '请求失败');
      }
    } else if (error.request) {
      console.error('请求未收到响应:', error.request);
      ElMessage.error('服务器未响应，请检查网络连接');
    } else {
      console.error('请求配置错误:', error.message);
      ElMessage.error('请求配置错误: ' + error.message);
    }
    
    return Promise.reject(error)
  }
)

export default request
