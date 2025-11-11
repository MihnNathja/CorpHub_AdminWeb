// src/features/parameters/services/parameterService.js

import api from "../../services/api";

// 🧩 Lấy danh sách loại năng lực (có cấp độ con)
export const fetchCompetencyTypes = async () => {
  const res = await api.get("/api/parameters/competency-types");
  console.log(res);
  return res;
};

// 🧩 Lấy danh sách cấp độ năng lực (CRUD riêng)
export const fetchCompetencyLevels = async () => {
  const res = await api.get("/api/parameters/competency-levels");
  return res.data;
};

// 🧩 Lấy danh sách loại tài liệu (ví dụ nếu có)
export const fetchDocumentTypes = async () => {
  const res = await api.get("/api/parameters/document-types");
  return res.data;
};
