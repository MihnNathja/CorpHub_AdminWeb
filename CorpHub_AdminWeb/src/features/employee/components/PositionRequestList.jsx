import React, { useEffect, useState } from "react";
import usePositionRequests from "../hooks/usePositionRequests";

export default function PositionRequestList({ employeeId, onView }) {
  const { items, loading, error, loadByEmployee } = usePositionRequests();
  const [localEmployeeId, setLocalEmployeeId] = useState(employeeId);

  useEffect(() => {
    setLocalEmployeeId(employeeId);
  }, [employeeId]);

  useEffect(() => {
    loadByEmployee(localEmployeeId);
  }, [localEmployeeId, loadByEmployee]);

  if (!employeeId) return null;

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-3">Position Requests</h4>
      {loading ? (
        <div className="p-4">Đang tải...</div>
      ) : error ? (
        <div className="p-4 text-red-500">Lỗi khi tải dữ liệu</div>
      ) : items?.length === 0 ? (
        <div className="p-4 italic text-gray-500">Không có yêu cầu</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-2">ID</th>
                <th className="py-2">Ngày tạo</th>
                <th className="py-2">Người tạo</th>
                <th className="py-2">Vị trí hiện tại</th>
                <th className="py-2">Vị trí yêu cầu</th>
                <th className="py-2">Phòng ban mới</th>
                <th className="py-2">Loại</th>
                <th className="py-2">Ngày hiệu lực</th>
                <th className="py-2">Trạng thái</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">
                    {r.id?.slice ? r.id.slice(0, 8) : r.id}
                  </td>
                  <td className="py-2">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="py-2">{r.createdByName || "-"}</td>
                  <td className="py-2">{r.oldPositionName || "-"}</td>
                  <td className="py-2">{r.newPositionName || "-"}</td>
                  <td className="py-2">{r.newDepartmentName || "-"}</td>
                  <td className="py-2">{r.type || "-"}</td>
                  <td className="py-2">
                    {r.effectDate
                      ? new Date(r.effectDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2">{r.status || "-"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView && onView(r)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs"
                      >
                        Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
