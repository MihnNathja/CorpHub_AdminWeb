// src/features/user/components/UserDetailModal.jsx
import React from "react";
import { useUserDetail } from "../hooks/useUserDetail";

const UserDetailModal = ({ isOpen, onClose, userId }) => {
  const { currentUser, loading, error } = useUserDetail(userId, isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">Thông tin nhân viên</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p className="text-red-500">Lỗi: {error}</p>}
          {currentUser && (
            <div className="space-y-3">
              <div><strong>Họ tên:</strong> {currentUser.fullname}</div>
              <div><strong>Giới tính:</strong> {currentUser.gender || "Chưa có"}</div>
              <div><strong>Ngày sinh:</strong> {currentUser.dob || "Chưa có"}</div>
              <div><strong>Email:</strong> {currentUser.email}</div>
              <div><strong>Số điện thoại:</strong> {currentUser.phone}</div>
              <div><strong>Loại nhân viên:</strong> {currentUser.type}</div>
              <div><strong>Ngày bắt đầu:</strong> {currentUser.startDate || "Chưa có"}</div>
              <div><strong>Phòng ban:</strong> {currentUser.departmentName || "Chưa có"}</div>
              <div><strong>Vai trò:</strong> {currentUser.roleName}</div>
              <div><strong>Trạng thái:</strong> {currentUser.active ? "Hoạt động" : "Ngưng"}</div>
              <div><strong>OTP hết hạn:</strong> {currentUser.expired || "Chưa có"}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
