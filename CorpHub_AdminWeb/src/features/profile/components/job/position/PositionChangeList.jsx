import React, { useEffect, useState } from "react";
import { usePositionChangeRequest } from "../../../hooks/usePositionChangeRequest";
import PositionChangeCreateModal from "./PositionChangeCreateModal";

const PositionChangeList = ({ employeeId }) => {
  const { items, getRequestsByEmployee, loading } = usePositionChangeRequest();
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    if (employeeId) {
      getRequestsByEmployee(employeeId);
    }
  }, [employeeId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Danh sách yêu cầu thay đổi chức danh
        </h3>

        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Tạo yêu cầu mới
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {loading && <div>Đang tải...</div>}

        {!loading && items && items.length === 0 && (
          <div className="text-gray-600">Không có yêu cầu nào.</div>
        )}

        {items &&
          items.map((req) => (
            <div
              key={req.id}
              className="border rounded p-3 flex justify-between"
            >
              <div>
                <div className="font-medium">{req.type}</div>
                <div className="text-sm text-gray-600">
                  {req.oldPositionName || "-"} → {req.newPositionName}
                </div>
                <div className="text-sm text-gray-600">
                  {req.oldDepartmentName || "-"} → {req.newDepartmentName}
                </div>
                <div className="text-sm text-gray-600">
                  Ngày hiệu lực: {req.effectDate}
                </div>
              </div>

              <div className={`font-semibold ${getStatusColor(req.status)}`}>
                {req.status}
              </div>
            </div>
          ))}
      </div>

      {/* Create modal */}
      {openCreate && (
        <PositionChangeCreateModal
          employeeId={employeeId}
          onClose={() => setOpenCreate(false)}
        />
      )}
    </div>
  );
};

export default PositionChangeList;
