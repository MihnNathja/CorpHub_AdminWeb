import api from "../../../services/api";

/**
 * 1️⃣ UPLOAD FILE TẠM TRƯỚC KHI SUBMIT
 * Upload file tạm và nhận về objectKey + presignedUrl
 */
export const uploadTemp = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api
    .post(`/api/absence/attachments/upload-temp`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

/**
 * XÓA FILE TẠM KỲNG SAU KHI UPLOAD
 * Gọi khi user chỉ mới upload chưa submit mà muốn xóa
 */
export const deleteTemp = (objectKey) =>
  api
    .delete(`/api/absence/attachments/temp`, {
      params: { objectKey },
    })
    .then((res) => res.data);

/**
 * 2️⃣ THAY THẾ ATTACHMENT SAU SUBMIT
 * Replace attachment của một absence request đã được submit
 */
export const replaceAttachment = (requestId, newFile) => {
  console.log("replace ", requestId);
  const fd = new FormData();
  fd.append("file", newFile);
  return api
    .put(`/api/absence/attachments/${requestId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

/**
 * 3️⃣ XÓA ATTACHMENT SAU SUBMIT
 * Delete attachment của một absence request đã được submit
 */
export const deleteAttachment = (requestId) =>
  api.delete(`/api/absence/attachments/${requestId}`).then((res) => res.data);

/**
 * 4️⃣ TẢI ATTACHMENT
 * Download attachment file
 * Returns: { blob, filename }
 */
export const downloadAttachment = (requestId) =>
  api
    .get(`/api/absence/attachments/${requestId}/download`, {
      responseType: "blob",
    })
    .then((res) => {
      // Try to extract filename from Content-Disposition header
      const cd =
        res.headers &&
        (res.headers["content-disposition"] ||
          res.headers["Content-Disposition"]);
      let filename = "attachment";
      if (cd) {
        const match = cd.match(/filename\*?=(?:UTF-8''")?"?([^";]+)"?/i);
        if (match && match[1]) {
          try {
            filename = decodeURIComponent(match[1]);
          } catch (e) {
            filename = match[1];
          }
        }
      }
      return { blob: res.data, filename };
    });
