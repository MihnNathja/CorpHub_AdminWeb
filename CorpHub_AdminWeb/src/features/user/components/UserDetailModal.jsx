// src/features/user/components/UserDetailModal.jsx
import React, { useMemo, useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Circle,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Image as ImageIcon,
} from "lucide-react";
import { useUserDetail } from "../hooks/useUserDetail";
const UserDetailModal = ({ isOpen, onClose, userId }) => {
  const { currentUser, loading, error } = useUserDetail(userId, isOpen);

  const displayUser = useMemo(() => {
    if (!currentUser) return null;
    const employee = currentUser.employee || {};
    return {
      ...currentUser,
      employee,
      fullName:
        employee.fullName || currentUser.fullName || currentUser.fullname,
      gender: employee.gender,
      departmentName: employee.departmentName,
      positionName: employee.positionName,
      avatarUrl: employee.avatarUrl,
    };
  }, [currentUser]);

  const handleClose = () => {
    onClose();
  };

  const initials = useMemo(() => {
    if (!displayUser?.fullName) return "?";
    return displayUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(-2)
      .map((s) => s[0])
      .join("")
      .toUpperCase();
  }, [displayUser]);

  const statusTone = displayUser?.active
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-slate-100 text-slate-700 border-slate-200";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 z-10 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md overflow-hidden">
              {displayUser?.avatarUrl ? (
                <img
                  src={displayUser.avatarUrl}
                  alt={displayUser.fullName}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-900">
                <UserRound size={18} className="text-blue-600" />
                <span className="text-lg font-semibold">
                  {displayUser?.fullName || "Người dùng"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold border ${statusTone}`}
                >
                  <Circle size={10} />
                  {displayUser?.active ? "Hoạt động" : "Ngưng"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 border border-slate-200">
                  <ShieldCheck size={12} />
                  {displayUser?.roleName || "No role"}
                </span>
                {displayUser?.username && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700 border border-blue-200">
                    @{displayUser.username}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          {loading && (
            <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
          )}
          {error && <p className="text-sm text-red-500">Lỗi: {error}</p>}
          {!loading && !error && displayUser && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm text-slate-700">
              <InfoCard
                icon={<Mail size={16} className="text-blue-600" />}
                label="Tài khoản"
                value={displayUser.username || "-"}
              />
              <InfoCard
                icon={<ShieldCheck size={16} className="text-indigo-600" />}
                label="Vai trò"
                value={displayUser.roleName || "-"}
              />
              <InfoCard
                icon={<Circle size={12} className="text-emerald-600" />}
                label="Trạng thái"
                value={displayUser.active ? "Hoạt động" : "Ngưng"}
              />
              <InfoCard
                icon={<UserRound size={16} className="text-slate-600" />}
                label="Họ tên"
                value={displayUser.fullName || "-"}
              />
              <InfoCard
                icon={<UserRound size={16} className="text-slate-600" />}
                label="Giới tính"
                value={displayUser.gender || "Chưa có"}
              />
              <InfoCard
                icon={<Building2 size={16} className="text-slate-600" />}
                label="Phòng ban"
                value={displayUser.departmentName || "Chưa có"}
              />
              <InfoCard
                icon={<Briefcase size={16} className="text-slate-600" />}
                label="Chức danh"
                value={displayUser.positionName || "Chưa có"}
              />
              <InfoCard
                icon={<Phone size={16} className="text-blue-500" />}
                label="Số điện thoại"
                value={displayUser.employee?.phone || "-"}
              />
              <InfoCard
                icon={<Mail size={16} className="text-blue-500" />}
                label="Email"
                value={displayUser.employee?.email || displayUser.email || "-"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
    <div className="mt-0.5 h-9 w-9 rounded-lg bg-white text-slate-700 flex items-center justify-center border border-slate-200">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-900">{value || "-"}</p>
    </div>
  </div>
);

export default UserDetailModal;
