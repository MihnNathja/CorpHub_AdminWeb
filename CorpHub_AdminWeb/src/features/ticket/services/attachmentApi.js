import api from "../../../services/api";

export const fetchAttachments = (ticketId) =>
  api.get(`/api/ticket-attachments/${ticketId}`);

export const uploadAttachments = (ticketId, files) => {
  const fd = new FormData();
  files.forEach((file) => fd.append("attachments", file));
  return api.post(`/api/ticket-attachments/${ticketId}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteAttachment = (attachmentId) =>
  api.delete(`/api/ticket-attachments/${attachmentId}`);

export const downloadAttachment = (attachmentId) =>
  api.get(`/api/ticket-attachments/download/${attachmentId}`, {
    responseType: "blob",
  });
