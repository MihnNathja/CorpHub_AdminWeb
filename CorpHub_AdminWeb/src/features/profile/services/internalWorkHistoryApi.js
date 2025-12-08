import api from "../../../services/api";

/**
 * Lấy lịch sử làm việc nội bộ của nhân viên
 * @param {string} employeeId - UUID của nhân viên
 * @returns {Promise} Danh sách InternalWorkHistoryDto
 */
export const getByEmployee = (employeeId) =>
  api
    .get(`/api/internal-work-history/employee/${employeeId}`)
    .then((res) => res.data);

/**
 * Tạo mới lịch sử làm việc nội bộ
 * @param {Object} data - InternalWorkHistory data
 * @returns {Promise} Created history
 */
export const createHistory = (data) =>
  api.post(`/api/internal-work-history`, data).then((res) => res.data);
