// src/api/profileApi.js
import api from './axiosConfig';

export const profileApi = {
  getMyProfile: () => api.get('/profile/me'),
  updateMyProfile: (data) => api.put('/profile/me', data),
};