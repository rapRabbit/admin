import { defineStore } from 'pinia';
import { userApi } from '@/api';

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
    async login(username: string, password: string) {
      try {
        const { data } = await userApi.login({ username, password });
        this.token = data.token;
        localStorage.setItem('token', data.token);
        return data;
      } catch (error) {
        console.error('登录失败', error);
        throw error;
      }
    },

    logout() {
      this.token = '';
      this.userInfo = {} as UserInfo;
      localStorage.removeItem('token');
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