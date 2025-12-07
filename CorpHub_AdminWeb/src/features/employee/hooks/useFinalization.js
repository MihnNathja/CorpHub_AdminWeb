import { useCallback, useState } from "react";
import {
  getFinalizationRequests,
  uploadDecisionFile,
} from "../services/employeeApi";

export default function useFinalization() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const loadFinalizationRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getFinalizationRequests("FINALIZED");
      const data = resp?.data?.data || resp?.data || [];
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const upload = useCallback(async (requestId, files, notes) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      // Simulate progress (backend không trả progress, nên client-side simulate)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) return prev + Math.random() * 30;
          return prev;
        });
      }, 500);

      const resp = await uploadDecisionFile(requestId, files, notes);
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Remove uploaded request from list
      setItems((prev) => prev.filter((item) => item.id !== requestId));

      return resp?.data?.data || resp?.data;
    } catch (err) {
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  return {
    items,
    loading,
    error,
    uploading,
    uploadProgress,
    loadFinalizationRequests,
    upload,
  };
}
