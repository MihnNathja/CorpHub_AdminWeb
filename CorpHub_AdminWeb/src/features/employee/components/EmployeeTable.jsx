import { useState } from "react";
import { useEmployee } from "../hooks/useEmployee";
import { useSelector } from "react-redux";

const EmployeeTable = () => {
  const { employees } = useSelector((state) => state.employees);
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Danh sách nhân viên
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="p-3">Ảnh</th>
            <th className="p-3">Họ và tên</th>
            <th className="p-3">Phòng ban</th>
            <th className="p-3">Role</th>
            <th className="p-3">Email</th>
            <th className="p-3">SĐT</th>
            <th className="p-3 text-center">Trạng thái</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td className="p-3">
                <img
                  src={emp.avatarUrl}
                  alt={emp.fullName}
                  className="h-12 w-12 rounded-full object-cover border"
                />
              </td>
              <td className="p-3 font-medium">{emp.fullName}</td>
              <td className="p-3">{emp.departmentName}</td>
              <td className="p-3">{emp.user?.roleName || "-"}</td>
              <td className="p-3">{emp.personalEmail}</td>
              <td className="p-3">{emp.phone}</td>
              <td className="p-3 text-center">
                {emp.user ? (
                  emp.user.active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      Inactive
                    </span>
                  )
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                    Chưa có tài khoản
                  </span>
                )}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => setSelected(emp)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chi tiết */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[700px] max-h-[80vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              {selected.fullName}
            </h3>
            <p>
              <strong>Email:</strong> {selected.personalEmail}
            </p>
            <p>
              <strong>SĐT:</strong> {selected.phone}
            </p>
            <p>
              <strong>Phòng ban:</strong> {selected.departmentName}
            </p>
            <p>
              <strong>Role:</strong> {selected.user?.roleName || "Chưa có"}
            </p>

            {/* Job Histories */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Lịch sử công việc</h4>
              {selected.jobHistories.length > 0 ? (
                <ul className="list-disc ml-6">
                  {selected.jobHistories.map((j) => (
                    <li key={j.id}>
                      {j.position} tại {j.departmentName || "N/A"} (
                      {j.startDate} → {j.endDate})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có</p>
              )}
            </div>

            {/* Competencies */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Năng lực</h4>
              {selected.competencies.length > 0 ? (
                <ul className="list-disc ml-6">
                  {selected.competencies.map((c) => (
                    <li key={c.id}>
                      [{c.type}] {c.name} - {c.level}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Không có</p>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
