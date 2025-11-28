import api from "../../../services/api";

export const doAttendance = (wsId, data) =>
    api.post(`/api/attendance/${wsId}`, data);