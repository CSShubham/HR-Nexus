import api from './axiosConfig';

export const attendanceApi = {
  punchIn: () => api.post('/attendance/punch-in'),
  punchOut: () => api.post('/attendance/punch-out'),
  getMyAttendance: () => api.get('/attendance/me'),
  getAllAttendance: () => api.get('/attendance'),
};