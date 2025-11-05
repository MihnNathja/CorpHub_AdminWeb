// src/features/document/hooks/useDocument.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import {
  downloadDocumentAsync,
  fetchDocumentTypes,
  fetchMyDocuments,
  uploadDocumentsAsync,
} from "../store/documentSlice";

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
      await dispatch(uploadDocumentsAsync(formData));
      getMyDocuments(true);
    },
    [dispatch]
  );

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

  // ⚙️ useMemo để cache giá trị state tránh re-render không cần thiết
  const state = useMemo(
    () => ({
      documents: items,
      types,
      loading,
      uploading,
      uploadSuccess,
      downloading,
      downloadSuccess,
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
      error,
      downloadingIds,
    ]
  );

  return {
    ...state,
    getTypes,
    uploadDocuments,
    downloadDocument,
    getMyDocuments,
  };
};
