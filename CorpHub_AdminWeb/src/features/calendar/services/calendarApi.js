import api from "../../../services/api";

export const getMeetings = () => api.get("/api/meetings");

export const saveMeeting = (meeting) => api.post("/api/meetings/save", meeting)

export const deleteMeeting = (id) => api.delete(`api/meetings/${id}`)