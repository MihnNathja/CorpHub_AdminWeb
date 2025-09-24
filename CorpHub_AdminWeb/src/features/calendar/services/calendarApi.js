import api from "../../../services/api";

export const getMeetings = () => api.get("/api/meetings");

export const createMeeting = (meeting) => api.post("/api/meetings/save", meeting)