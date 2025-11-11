import api from "../../../services/api";

export const getEmployeeSchedule = (params) =>
    api.get(`/api/work-schedules/employee-view`, { params });
