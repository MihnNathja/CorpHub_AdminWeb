// src/features/document/hooks/useDocument.js
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
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
      await dispatch(downloadDocumentAsync(documentId));
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
    }),
    [
      types,
      loading,
      uploading,
      uploadSuccess,
      downloading,
      downloadSuccess,
      error,
    ]
  );

  return {
    ...state,
    getTypes,
    uploadDocuments,
    downloadDocument,
  };
};
