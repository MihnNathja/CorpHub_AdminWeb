import api from "../../../services/api";

export const getDocumentTypes = async () => {
  const res = await api.get("/api/employee/document/type");
  return res.data;
};

export const uploadEmployeeDocuments = async (formData) => {
  console.log("Gọi đến API");
  await api.post("/api/employee/document/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const downloadEmployeeDocument = async (documentId) => {
  return api.get(`/api/employee/document/download/${documentId}`, {
    responseType: "blob",
  });
};
