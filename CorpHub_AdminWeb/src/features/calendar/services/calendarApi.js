import api from "../../../services/api";

export const getMeetings = (params) => api.get("/api/meetings", { params });

export const saveMeeting = (meeting) => api.post("/api/meetings/save", meeting)

export const deleteMeeting = (id) => api.delete(`api/meetings/${id}`)

export const confirmAttend = (id, isAccepted) =>
    api.put(`api/meetings/${id}/confirm?isAccepted=${isAccepted}`);
