import api from './axiosConfig';

export const authApi = {
  registerHR: (data) => api.post('/auth/register-hr', data),
  loginHR: (data) => api.post('/auth/login-hr', data),
  loginEmployee: (data) => api.post('/auth/login-employee', data),
};