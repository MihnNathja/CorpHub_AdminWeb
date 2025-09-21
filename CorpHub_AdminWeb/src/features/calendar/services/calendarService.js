import api from "../../../services/api";

export const getMeetings = () => api.get("/api/meetings");