import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { usePositionChangeRequest } from "../../../hooks/usePositionChangeRequest";
import { useDepartmentPositions } from "../../../hooks/useDepartmentPosition";
import { useAttachmentUpload } from "../../../hooks/useAttachmentUpload";

const PositionChangeCreateModal = ({ employeeId, onClose }) => {
  const { createRequest, loading } = usePositionChangeRequest();
  const { departments } = useDepartmentPositions();
  const { attachments, uploading, upload, remove } = useAttachmentUpload();

  const [selectedDeptId, setSelectedDeptId] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { employeeId, type: "PROMOTION" },
  });

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      createdById: localStorage.getItem("userId"),
      attachments,
    };

    await createRequest(payload);
    reset();
    onClose();
  };

  const positions =
    departments.find((d) => d.departmentId === selectedDeptId)?.positions || [];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm
                 flex items-center justify-center p-4 animate-fadeIn"
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-gray-200 
                   p-6 w-full max-w-lg animate-scaleIn"
      >
        {/* HEADER */}
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Tạo yêu cầu thay đổi chức danh
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* DEPARTMENT */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Phòng ban mới
            </label>
            <select
              {...register("newDepartmentId")}
              required
              className="w-full border border-gray-300 rounded-lg p-2 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSelectedDeptId(e.target.value)}
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </select>
          </div>

          {/* POSITION */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Chức danh mới
            </label>
            <select
              {...register("newPositionId")}
              required
              disabled={!selectedDeptId}
              className="w-full border border-gray-300 rounded-lg p-2 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         disabled:bg-gray-100"
            >
              <option value="">
                {selectedDeptId
                  ? "-- Chọn chức danh --"
                  : "Chọn phòng ban trước"}
              </option>

              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* REASON */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Lý do
            </label>
            <textarea
              {...register("reason")}
              className="w-full border border-gray-300 rounded-lg p-2 h-24 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập lý do thay đổi..."
            />
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Tài liệu minh chứng
            </label>

            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file, localStorage.getItem("userId"));
              }}
              className="border border-gray-300 rounded-lg p-2 w-full 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* ATTACHMENT LIST */}
            <div className="mt-3 space-y-2">
              {attachments.map((a) => (
                <div
                  key={a.fileKey}
                  className="flex justify-between items-center bg-gray-100
                             border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <span className="text-gray-700 truncate w-[80%]">
                    {a.fileName}
                  </span>
                  <button
                    type="button"
                    className="text-red-500 font-semibold hover:text-red-600"
                    onClick={() => remove(a.fileKey)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 bg-gray-100 
                         rounded-lg text-gray-700 hover:bg-gray-200"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 disabled:bg-blue-300"
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
