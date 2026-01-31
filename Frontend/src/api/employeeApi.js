import api from './axiosConfig';

export const employeeApi = {
  getAllEmployees: () => api.get('/employees'),
  getEmployeesWithWorkingStatus: () => api.get('/employees/working-status'),
  updateEmployee: (employeeId, data) => api.put(`/employees/${employeeId}`, data),
  onboardEmployee: (candidateId, data) => api.post(`/employees/onboard/${candidateId}`, data),
  offboardEmployee: (employeeId, data) => api.post(`/employees/offboard/${employeeId}`, data),
  getOffboardingInfo: () => api.get('/employees/offboarding/me'),
};