import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import {
    createAbsenceRequest,
    deleteAbsenceRequest,
    fetchMyAbsenceRequests,
    updateAbsenceRequest,
} from "../store/absenceRequestSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

/**
 * Hook for managing Absence Requests (Employee)
 */
export const useAbsenceRequest = () => {
    const dispatch = useDispatch();
    const { items, meta = {}, loading, error } = useSelector((state) => state.absenceRequest);
    const [page, setPage] = useState(meta.page ?? 0);
    const [size, setSize] = useState(meta.size ?? 9);

    // Load data when page or size changes
    useEffect(() => {
        dispatch(fetchMyAbsenceRequests({ page, size }));
    }, [dispatch, page, size]);

    const create = useCallback(async (data) => {
        try {
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
    }, [dispatch, page, size]);

    const update = useCallback(async (id, data) => {
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
    }, [dispatch, page, size]);

    const remove = useCallback(async (id) => {
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
    }, [dispatch, page, size]);

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
    };
};
