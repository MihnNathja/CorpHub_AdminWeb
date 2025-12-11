import React from "react";
import { Card } from "./EmployeeDetailCard";
import { InputField, SelectField, InfoRow } from "./EmployeeDetailFields";

const EmployeeDetailBasicSection = ({
  profile,
  basicForm,
  setBasicForm,
  editing,
  setEditing,
  saving,
  onSave,
  onCancel,
  formatDate,
}) => (
  <Card
    title="Thông tin cá nhân"
    subtitle={`Ngày vào: ${formatDate(profile.joinDate)}`}
    actions={
      editing ? (
        <>
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30"
        >
          Chỉnh sửa
        </button>
      )
    }
  >
    {editing ? (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InputField
          label="Họ và tên"
          value={basicForm.fullName}
          onChange={(e) =>
            setBasicForm((p) => ({
              ...p,
              fullName: e.target.value,
            }))
          }
        />
        <InputField
          label="Ngày sinh"
          type="date"
          value={basicForm.dob ? basicForm.dob.slice(0, 10) : ""}
          onChange={(e) => setBasicForm((p) => ({ ...p, dob: e.target.value }))}
        />
        <SelectField
          label="Giới tính"
          value={basicForm.gender || ""}
          onChange={(e) =>
            setBasicForm((p) => ({ ...p, gender: e.target.value }))
          }
          options={[
            { value: "", label: "-- Chọn --" },
            { value: "Male", label: "Nam" },
            { value: "Female", label: "Nữ" },
            { value: "Other", label: "Khác" },
          ]}
        />
        <InputField
          label="Ngày vào làm"
          type="date"
          value={basicForm.joinDate ? basicForm.joinDate.slice(0, 10) : ""}
          onChange={(e) =>
            setBasicForm((p) => ({
              ...p,
              joinDate: e.target.value,
            }))
          }
        />
      </div>
    ) : (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoRow label="Họ và tên" value={profile.fullName} />
        <InfoRow label="Ngày sinh" value={formatDate(profile.dob)} />
        <InfoRow label="Giới tính" value={profile.gender} />
        <InfoRow label="Ngày vào làm" value={formatDate(profile.joinDate)} />
      </div>
    )}
  </Card>
);

export default EmployeeDetailBasicSection;
