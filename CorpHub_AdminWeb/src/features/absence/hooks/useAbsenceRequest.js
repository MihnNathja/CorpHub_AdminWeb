import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import {
  createAbsenceRequest,
  deleteAbsenceRequest,
  fetchMyAbsenceRequests,
  updateAbsenceRequest,
  uploadAbsenceProof,
  deleteTempAttachment,
  deleteAbsenceAttachment,
  replaceAbsenceAttachment,
} from "../store/absenceRequestSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Absence Requests (Employee)
 */
export const useAbsenceRequest = () => {
  const dispatch = useDispatch();
  const {
    items,
    meta = {},
    loading,
    error,
    uploading,
    draftAttachment,
  } = useSelector((state) => state.absenceRequest);
  const [page, setPage] = useState(meta.page ?? 0);
  const [size, setSize] = useState(meta.size ?? 9);

  // Load data when page, size, or filter changes
  useEffect(() => {
    dispatch(fetchMyAbsenceRequests({ page, size }));
  }, [dispatch, page, size]);

  const create = useCallback(
    async (data) => {
      try {
        console.log(data);
        const res = await dispatch(createAbsenceRequest(data));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Absence request created successfully!");
          dispatch(fetchMyAbsenceRequests({ page, size }));
        } else {
          console.error(res);
          showError(res.payload?.message || "Cannot create absence request!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error creating absence request!");
      }
    },
    [dispatch, page, size]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        const res = await dispatch(updateAbsenceRequest({ id, data }));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Absence request updated successfully!");
          dispatch(fetchMyAbsenceRequests({ page, size }));
        } else {
          showError(res.payload?.message || "Cannot update absence request!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error updating absence request!");
      }
    },
    [dispatch, page, size]
  );

  const remove = useCallback(
    async (id) => {
      try {
        const res = await dispatch(deleteAbsenceRequest(id));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Absence request deleted successfully!");
          dispatch(fetchMyAbsenceRequests({ page, size }));
        } else {
          console.log(error);
          showError(error || "Cannot delete absence request!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error deleting absence request!");
      }
    },
    [dispatch, page, size]
  );

  const uploadAttachment = useCallback(
    async (file) => {
      try {
        const res = await dispatch(uploadAbsenceProof(file));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Uploaded successfully");
        } else {
          showError(res.payload?.message || "Cannot upload file");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error uploading file");
      }
    },
    [dispatch]
  );

  const removeAttachment = useCallback(() => {
    dispatch({ type: "absenceRequest/clearDraftAttachment" });
  }, [dispatch]);

  /**
   * Delete temp attachment (before submit)
   * Called when user uploaded file but hasn't submitted the form
   */
  const deleteTempFile = useCallback(
    async (objectKey) => {
      try {
        const res = await dispatch(deleteTempAttachment(objectKey));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("File deleted successfully");
        } else {
          showError(res.payload?.message || "Cannot delete file");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error deleting file");
      }
    },
    [dispatch]
  );

  /**
   * Delete attachment (after submit)
   * Called when user has already submitted and wants to delete the attachment from the request
   */
  const deleteAttachment = useCallback(
    async (requestId) => {
      try {
        const res = await dispatch(deleteAbsenceAttachment(requestId));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("File deleted successfully");
        } else {
          showError(res.payload?.message || "Cannot delete file");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error deleting file");
      }
    },
    [dispatch]
  );

  /**
   * Replace attachment (after submit)
   * Called when user wants to replace an already submitted attachment
   */
  const replaceAttachment = useCallback(
    async (requestId, newFile) => {
      try {
        const res = await dispatch(
          replaceAbsenceAttachment({ requestId, newFile })
        );
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("File replaced successfully");
        } else {
          showError(res.payload?.message || "Cannot replace file");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Error replacing file");
      }
    },
    [dispatch]
  );

  return {
    absenceRequests: items || [],
    meta,
    loading,
    error,
    page,
    setPage,
    size,
    setSize,
    create,
    update,
    remove,
    uploadAttachment,
    removeAttachment,
    deleteTempFile,
    deleteAttachment,
    replaceAttachment,
    draftAttachment,
    uploading,
  };
};
