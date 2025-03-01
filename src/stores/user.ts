import { defineStore } from 'pinia';
import { userApi } from '@/api';
import axios from 'axios';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo,
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const data  = await userApi.login({ email, password });
        console.debug(data);
        
        // 保存token
        this.token = data.token;
        localStorage.setItem('token', data.token);
        
        // 设置全局默认请求头
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        return data.user;
      } catch (error) {
        console.error('登录失败', error);
        throw error;
      }
    },

    logout() {
      this.token = '';
      this.userInfo = {} as UserInfo;
      localStorage.removeItem('token');
      
      // 清除全局默认请求头
      delete axios.defaults.headers.common['Authorization'];
    },

    async getUserInfo() {
      try {
        const { data } = await userApi.getInfo();
        this.userInfo = data;
        return data;
      } catch (error) {
        console.error('获取用户信息失败', error);
        throw error;
      }
    },
  },
}); 