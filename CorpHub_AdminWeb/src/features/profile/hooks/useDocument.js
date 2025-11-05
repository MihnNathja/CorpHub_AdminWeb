// src/features/document/hooks/useDocument.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import {
  downloadDocumentAsync,
  fetchDocumentTypes,
  uploadDocumentsAsync,
} from "../store/documentSlice";

export const useDocument = () => {
  const dispatch = useDispatch();

  // Lấy state từ store
  const {
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
  const getTypes = useCallback(() => {
    dispatch(fetchDocumentTypes());
  }, [dispatch]);

  const uploadDocuments = useCallback(
    async (formData) => {
      await dispatch(uploadDocumentsAsync(formData));
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
  };
};
