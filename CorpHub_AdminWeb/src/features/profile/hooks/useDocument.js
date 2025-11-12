// src/features/document/hooks/useDocument.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import {
  checkDocumentRelationsAsync,
  deleteDocumentAsync,
  downloadDocumentAsync,
  fetchDocumentTypes,
  fetchMyDocuments,
  uploadDocumentsAsync,
} from "../store/documentSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useDocument = () => {
  const dispatch = useDispatch();

  // Lấy state từ store
  const {
    items,
    types,
    loading,
    uploading,
    uploadSuccess,
    downloading,
    downloadSuccess,
    error,
    checking,
    deleting,
    relationInfo,
  } = useSelector((state) => state.document);

  const [downloadingIds, setDownloadingIds] = useState([]);

  // 🧭 Action gọi API
  const getTypes = useCallback(
    (force = false) => {
      if (force || types.length === 0) {
        dispatch(fetchDocumentTypes());
      }
    },
    [dispatch, types.length]
  );

  const getMyDocuments = useCallback(
    (force = false) => {
      if (force || items.length === 0) {
        dispatch(fetchMyDocuments());
      }
    },
    [dispatch, items.length]
  );

  const uploadDocuments = useCallback(
    async (formData) => {
      console.log("Gọi đến API upload: ", formData);
      await dispatch(uploadDocumentsAsync(formData));
      getMyDocuments(true);
    },
    [dispatch]
  );

  const uploadDocument = async (formData) => {
    const res = await dispatch(uploadDocumentsAsync(formData)).unwrap();
    return res; // đây là documentIds được return trong slice
  };

  const downloadDocument = useCallback(
    async (documentId) => {
      try {
        setDownloadingIds((prev) => [...prev, documentId]); // bắt đầu tải

        await dispatch(downloadDocumentAsync(documentId)).unwrap(); // unwrap() để chờ kết quả thực tế (nếu dùng createAsyncThunk)
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        // ✅ cleanup: xóa ID khỏi danh sách đang tải dù thành công hay lỗi
        setDownloadingIds((prev) => prev.filter((id) => id !== documentId));
      }
    },
    [dispatch]
  );

  // 🔍 Kiểm tra xem tài liệu có liên kết với chứng chỉ không
  const checkRelations = useCallback(
    async (documentId) => {
      try {
        const result = await dispatch(
          checkDocumentRelationsAsync(documentId)
        ).unwrap();
        return result; // { hasRelations, relatedCompetencies }
      } catch (err) {
        console.error("Lỗi kiểm tra liên kết tài liệu:", err);
        showError("Không thể kiểm tra liên kết tài liệu");
        return null;
      }
    },
    [dispatch]
  );

  // 🗑️ Xóa tài liệu
  const removeDocument = useCallback(
    async (documentId) => {
      try {
        // 1️⃣ Kiểm tra liên kết
        const result = await checkRelations(documentId);
        if (!result) return;

        if (result.hasRelations) {
          const listNames = result.relatedCompetencies
            .map((r) => r.name)
            .join(", ");
          showError(
            `Không thể xóa. Tài liệu này đang được sử dụng trong chứng chỉ: ${listNames}`
          );
          return;
        }

        // 2️⃣ Xác nhận trước khi xóa
        const confirmed = window.confirm("Bạn có chắc muốn xóa tài liệu này?");
        if (!confirmed) return;

        // 3️⃣ Thực hiện xóa
        await dispatch(deleteDocumentAsync(documentId)).unwrap();
        getMyDocuments(true);
      } catch (err) {
        console.error("Xóa tài liệu lỗi:", err);
      }
    },
    [dispatch, checkRelations, getMyDocuments]
  );

  // ⚙️ Gom toàn bộ state
  const state = useMemo(
    () => ({
      documents: items,
      types,
      loading,
      uploading,
      uploadSuccess,
      downloading,
      downloadSuccess,
      checking,
      deleting,
      relationInfo,
      error,
      downloadingIds,
    }),
    [
      items,
      types,
      loading,
      uploading,
      uploadSuccess,
      downloading,
      downloadSuccess,
      checking,
      deleting,
      relationInfo,
      error,
      downloadingIds,
    ]
  );

  // ✅ Export các hàm hành động ra ngoài
  return {
    ...state,
    getTypes,
    getMyDocuments,
    uploadDocuments,
    uploadDocument,
    downloadDocument,
    checkRelations,
    removeDocument,
  };
};
