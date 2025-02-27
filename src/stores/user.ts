import { defineStore } from 'pinia';
import axios from 'axios';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as UserInfo | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const { data } = await axios.post('/api/auth/login', { email, password });
        this.token = data.token;
        this.userInfo = data.user;
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || '登录失败');
      }
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
  },
}); 