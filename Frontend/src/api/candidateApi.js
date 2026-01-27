import api from './axiosConfig';

export const candidateApi = {
  applyCandidate: (data) => api.post('/candidates/apply', data),
  getAllCandidates: () => api.get('/candidates'),
  updateCandidateStatus: (id, data) => api.put(`/candidates/${id}/status`, data),
};