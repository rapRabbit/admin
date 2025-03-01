import request from '@/utils/request'

// 用户相关接口
export const userApi = {
  login: (data: any) => request.post('/auth/login', data),
  getInfo: () => request.get('/user'),
  logout: () => request.post('/auth/logout'),
  list: (params: any) => request.get('/users', { params }),
  detail: (id: string) => request.get(`/users/${id}`),
  activate: (id: string) => request.put(`/users/${id}/activate`),
  deactivate: (id: string) => request.put(`/users/${id}/deactivate`)
}

// 商品相关接口
export const productApi = {
  list: (params: any) => request.get('/products', { params }),
  detail: (id: string) => request.get(`/products/${id}`),
  create: (data: any) => request.post('/products', data),
  update: (id: string, data: any) => request.put(`/products/${id}`, data),
  delete: (id: string) => request.delete(`/products/${id}`),
  activate: (id: string) => request.put(`/products/${id}/activate`),
  deactivate: (id: string) => request.put(`/products/${id}/deactivate`)
}

// 订单相关接口
export const orderApi = {
  list: (params: any) => request.get('/orders', { params }),
  detail: (id: string) => request.get(`/orders/${id}`),
  create: (data: any) => request.post('/orders', data),
  update: (id: string, data: any) => request.put(`/orders/${id}`, data),
  cancel: (id: string) => request.put(`/orders/${id}/cancel`),
  complete: (id: string) => request.put(`/orders/${id}/complete`)
}

// 可以继续添加其他模块... 