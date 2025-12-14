import api from "../../../services/api";

export const getEmployeeSchedule = (params) =>
  api.get(`/api/work-schedules/employee-view`, { params });

export const getScheduleForUserOnDate = () =>
  api.get(`/api/work-schedules/today`);

export const autoAssign = (data) =>
  api.post(`/api/work-schedules/auto-assign`, data);

export const create = (data) => api.post(`/api/work-schedules`, data);

export const update = (id, data) => api.put(`/api/work-schedules/${id}`, data);

export const remove = (id) => api.delete(`/api/work-schedules/${id}`);

// Export work schedules to file (Excel/CSV)
export const exportWorkSchedules = (data, config = {}) =>
  api.post(`/api/work-schedules/export`, data, {
    responseType: "blob",
    ...config,
  });
