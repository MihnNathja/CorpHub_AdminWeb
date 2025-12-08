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
          showSuccess("Tạo đơn nghỉ thành công!");
          dispatch(fetchMyAbsenceRequests({ page, size }));
        } else {
          console.error(res);
          showError(res.payload?.message || "Không thể tạo đơn nghỉ!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi tạo đơn nghỉ!");
      }
    },
    [dispatch, page, size]
  );

  const update = useCallback(
    async (id, data) => {
      try {
        const res = await dispatch(updateAbsenceRequest({ id, data }));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Cập nhật đơn nghỉ thành công!");
          dispatch(fetchMyAbsenceRequests({ page, size }));
        } else {
          showError(res.payload?.message || "Không thể cập nhật đơn nghỉ!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi cập nhật đơn nghỉ!");
      }
    },
    [dispatch, page, size]
  );

  const remove = useCallback(
    async (id) => {
      try {
        const res = await dispatch(deleteAbsenceRequest(id));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Xóa đơn nghỉ thành công!");
          dispatch(fetchMyAbsenceRequests({ page, size }));
        } else {
          console.log(error);
          showError(error || "Không thể xóa đơn nghỉ!");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi xóa đơn nghỉ!");
      }
    },
    [dispatch, page, size]
  );

  const uploadAttachment = useCallback(
    async (file) => {
      try {
        const res = await dispatch(uploadAbsenceProof(file));
        if (res.meta.requestStatus === "fulfilled") {
          showSuccess("Tải lên thành công");
        } else {
          showError(res.payload?.message || "Không thể tải file lên");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi tải file lên");
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
          showSuccess("Xóa tệp thành công");
        } else {
          showError(res.payload?.message || "Không thể xóa tệp");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi xóa tệp");
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
          showSuccess("Xóa tệp thành công");
        } else {
          showError(res.payload?.message || "Không thể xóa tệp");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi xóa tệp");
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
          showSuccess("Thay thế tệp thành công");
        } else {
          showError(res.payload?.message || "Không thể thay thế tệp");
        }
        return res;
      } catch (err) {
        console.error(err);
        showError("Lỗi khi thay thế tệp");
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
