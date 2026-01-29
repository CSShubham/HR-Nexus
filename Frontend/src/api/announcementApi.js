import api from "./axiosConfig";

export const announcementApi = {
  createAnnouncement: (data) => api.post("/announcements", data),
  getAnnouncements: () => api.get("/announcements"),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
  updateAnnouncement: (id, data) => api.put(`/announcements/${id}`, data),
};
