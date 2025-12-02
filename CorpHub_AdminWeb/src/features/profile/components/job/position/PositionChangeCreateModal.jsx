import React from "react";
import { useForm } from "react-hook-form";
import { usePositionChangeRequest } from "../../../hooks/usePositionChangeRequest";

const PositionChangeCreateModal = ({ employeeId, onClose }) => {
  const { createRequest, loading } = usePositionChangeRequest();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      employeeId,
      type: "PROMOTION",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      createdById: localStorage.getItem("userId"), // hoặc lấy từ auth context
      attachments: [], // TODO: thêm màn upload file sau
    };

    await createRequest(payload);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Tạo yêu cầu thay đổi chức danh
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Loại thay đổi
            </label>
            <select {...register("type")} className="w-full border rounded p-2">
              <option value="PROMOTION">Thăng chức</option>
              <option value="TRANSFER">Điều chuyển</option>
              <option value="ROTATION">Luân chuyển</option>
              <option value="DEMOTION">Giáng chức</option>
              <option value="ASSIGNMENT">Bổ nhiệm</option>
            </select>
          </div>

          {/* New Position */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Chức danh mới
            </label>
            <input
              {...register("newPositionId")}
              placeholder="Nhập PositionId"
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* New Department */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Phòng ban mới
            </label>
            <input
              {...register("newDepartmentId")}
              placeholder="Nhập DepartmentId"
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Effect Date */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Ngày hiệu lực
            </label>
            <input
              type="date"
              {...register("effectDate")}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1 text-sm font-medium">Lý do</label>
            <textarea
              {...register("reason")}
              placeholder="Lý do thay đổi"
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Đang tạo..." : "Tạo yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PositionChangeCreateModal;
