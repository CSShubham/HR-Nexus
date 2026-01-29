import api from './axiosConfig';

export const leaveApi = {
  applyLeave: (data) => api.post('/leaves/apply', data),
  getMyLeaves: () => api.get('/leaves/me'),
  getAllLeaves: (page=1, limit=10) => api.get(`/leaves?page=${page}&limit=${limit}`),
  updateLeaveStatus: (id, data) => api.put(`/leaves/${id}`, data),
};