import api from "../../../services/api";

export const getDocumentTypes = async () => {
  const res = await api.get("/api/employee/document/type");
  return res.data;
};

export const getMyDocuments = async () => {
  const res = await api.get("/api/employee/me/documents");
  return res.data;
};

export const uploadEmployeeDocuments = async (formData) => {
  const res = await api.post("/api/employee/document/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  console.log("Gọi đến API: ", res);
  return res.data;
};

export const downloadEmployeeDocument = async (documentId) => {
  console.log(documentId);
  return api.get(`/api/employee/document/download/${documentId}`, {
    responseType: "blob",
  });
};

export const checkDocumentRelations = async (id) => {
  const res = await api.get(`/api/employee/document/${id}/check-relations`);
  return res.data;
};

export const deleteDocument = async (id) => {
  const res = await api.delete(`/api/employee/document/${id}`);
  return res.data;
};
