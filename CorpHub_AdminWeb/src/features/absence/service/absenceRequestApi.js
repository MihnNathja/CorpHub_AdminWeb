import api from "../../../services/api";

export const getPendingForApprover = (params) =>
  api.get(`/api/absence/requests/pending-approval`, { params });

export const getAllMyApprovals = (params) =>
  api.get(`/api/absence/requests/my-approvals`, { params });

export const getMyReq = (params) =>
  api.get(`/api/absence/requests/my`, { params });

export const create = (data) => api.post(`/api/absence/requests`, data);

export const uploadProof = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return api
    .post(`/api/absence/attachments/upload`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

/**
 * Delete an attachment by objectKey
 */
export const deleteAttachment = (objectKey) =>
  api.delete(`/api/absence/attachments`, {
    params: { objectKey },
  });

/**
 * Replace an attachment (delete old, upload new)
 */
export const replaceAttachment = (oldKey, newFile) => {
  const fd = new FormData();
  fd.append("file", newFile);
  return api
    .put(`/api/absence/attachments`, fd, {
      params: { oldKey },
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

/**
 * Download attachment file by objectKey
 * Returns an object: { blob, filename }
 */
export const downloadAttachment = (objectKey) =>
  api
    .get(`/api/absence/attachments/download`, {
      params: { objectKey },
      responseType: "blob",
    })
    .then((res) => {
      // Try to extract filename from Content-Disposition header
      const cd =
        res.headers &&
        (res.headers["content-disposition"] ||
          res.headers["Content-Disposition"]);
      let filename = objectKey;
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

export const update = (id, data) =>
  api.put(`/api/absence/requests/${id}`, data);

export const remove = (id) => api.delete(`/api/absence/requests/${id}`);

export const approveOrReject = (instanceId, payload) =>
  api.put(`/api/absence/requests/${instanceId}/approval`, payload);
