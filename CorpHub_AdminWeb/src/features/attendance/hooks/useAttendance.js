import { useDispatch, useSelector } from "react-redux";
import { submitAttendance } from "../store/attendanceSlice";
import { useCallback } from "react";
import { showSuccess, showError } from "../../../utils/toastUtils";

export const useAttendance = () => {
    const dispatch = useDispatch();

    const {
        records,     // { wsId: record }
        loading,
        error,
        lastUpdate
    } = useSelector((state) => state.attendance);

    /**
     * Gửi chấm công cho 1 workScheduleId
     * Server tự xác định CHECK IN hay CHECK OUT
     */
    const checkInOut = useCallback(async (wsId, data) => {
        try {
            const res = await dispatch(submitAttendance({ wsId, data })).unwrap();

            showSuccess(res.message || "Chấm công thành công!");

            return res;
        } catch (err) {
            const msg = err.message ||
                "Không thể chấm công. Vui lòng thử lại!";

            showError(msg);
            throw err;
        }
    }, [dispatch]);

    /**
     * Lấy attendance record cho 1 wsId
     */
    const getRecord = useCallback(
        (wsId) => records[wsId] || null,
        [records]
    );

    return {
        loading,
        error,
        lastUpdate,
        records,
        getRecord,
        checkInOut,
    };
};
