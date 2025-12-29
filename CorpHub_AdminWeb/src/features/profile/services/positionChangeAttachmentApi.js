// src/services/positionChangeAttachmentApi.js

import api from "../../../services/api";

export const uploadPositionChangeAttachment = async (file, uploadedById) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploadedById", uploadedById);

  const res = await api.post(
    "/api/position-change/attachments/upload",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  console.log(res);

  return res.data; // { fileName, fileUrl, uploadedById, fileKey }
};
