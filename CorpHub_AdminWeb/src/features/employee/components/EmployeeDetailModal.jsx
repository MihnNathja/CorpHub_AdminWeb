import React from "react";
import PositionRequestList from "./PositionRequestList";
import {
  Mail,
  Phone,
  Calendar,
  UserRound,
  Briefcase,
  Award,
  X,
} from "lucide-react";

const EmployeeDetailModal = ({ selected, setSelected }) => {
  if (!selected) return null; // 🔒 Không render nếu chưa chọn

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[700px] max-h-[85vh] overflow-y-auto p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          {/* Avatar */}
          <img
            src={
              selected.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                selected.fullName
              )}`
            }
            alt={selected.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <h3 className="text-2xl font-bold text-blue-600">
              {selected.fullName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {selected.departmentName || "Chưa có phòng ban"}
            </p>

            {/* Role & Status */}
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                {selected.user?.roleName || "Không có quyền"}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  selected.user?.active
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {selected.user?.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="text-blue-500" size={18} />
            <div>
              <p className="text-gray-500 text-sm">Email cá nhân</p>
              <p className="font-medium">{selected.personalEmail || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-blue-500" size={18} />
            <div>
              <p className="text-gray-500 text-sm">Số điện thoại</p>
              <p className="font-medium">{selected.phone || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-500" size={18} />
            <div>
              <p className="text-gray-500 text-sm">Ngày sinh</p>
              <p className="font-medium">
                {selected.dob
                  ? new Date(selected.dob).toLocaleDateString("vi-VN")
                  : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserRound className="text-blue-500" size={18} />
            <div>
              <p className="text-gray-500 text-sm">Giới tính</p>
              <p className="font-medium">{selected.gender || "—"}</p>
            </div>
          </div>
        </div>

        {/* Job Histories */}
        <div className="mt-6">
          <h4 className="flex items-center gap-2 text-lg font-semibold mb-2 border-b pb-1">
            <Briefcase size={18} className="text-blue-500" />
            Lịch sử công việc
          </h4>
          {selected.jobHistories?.length > 0 ? (
            <ul className="space-y-2">
              {selected.jobHistories.map((j) => (
                <li
                  key={j.id}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                >
                  <p className="font-medium text-blue-600">
                    {j.position || "Chưa rõ"}{" "}
                    <span className="text-gray-500">
                      ({j.departmentName || "N/A"})
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {j.startDate} → {j.endDate || "Hiện tại"}
                  </p>
                  {j.note && (
                    <p className="text-xs italic text-gray-400 mt-1">
                      "{j.note}"
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Không có dữ liệu</p>
          )}
        </div>

        {/* Competencies */}
        <div className="mt-6">
          <h4 className="flex items-center gap-2 text-lg font-semibold mb-2 border-b pb-1">
            <Award size={18} className="text-blue-500" />
            Năng lực
          </h4>
          {selected.competencies?.length > 0 ? (
            <ul className="space-y-2">
              {selected.competencies.map((c) => (
                <li
                  key={c.id}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                >
                  <p className="font-medium text-blue-600">
                    [{c.type}] {c.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cấp độ: {c.level || "—"} | Cấp bởi: {c.issuedBy || "—"}
                  </p>
                  {c.issuedDate && (
                    <p className="text-xs text-gray-400">
                      Ngày cấp:{" "}
                      {new Date(c.issuedDate).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">Không có dữ liệu</p>
          )}
        </div>

        {/* Position Requests */}
        <PositionRequestList employeeId={selected.id} />

        {/* Footer */}
        <div className="mt-8 text-right">
          <button
            onClick={() => setSelected(null)}
            className="px-5 py-2.5 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
