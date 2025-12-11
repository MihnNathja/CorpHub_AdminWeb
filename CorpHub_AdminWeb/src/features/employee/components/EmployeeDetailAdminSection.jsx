import React from "react";
import { Banknote } from "lucide-react";
import { Card } from "./EmployeeDetailCard";
import { InputField, TextAreaField, InfoRow } from "./EmployeeDetailFields";

const EmployeeDetailAdminSection = ({
  adminInfo,
  adminForm,
  setAdminForm,
  editing,
  setEditing,
  saving,
  onSave,
  onCancel,
  formatDate,
}) => (
  <Card
    title="Thông tin hành chính"
    icon={<Banknote size={18} />}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="CCCD/CMND"
          value={adminForm.identityNumber}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              identityNumber: e.target.value,
            }))
          }
        />
        <InputField
          label="Ngày cấp"
          type="date"
          value={
            adminForm.identityIssuedDate
              ? adminForm.identityIssuedDate.slice(0, 10)
              : ""
          }
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              identityIssuedDate: e.target.value,
            }))
          }
        />
        <InputField
          label="Nơi cấp"
          value={adminForm.identityIssuedPlace}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              identityIssuedPlace: e.target.value,
            }))
          }
        />
        <InputField
          label="MST"
          value={adminForm.taxCode}
          onChange={(e) =>
            setAdminForm((p) => ({ ...p, taxCode: e.target.value }))
          }
        />
        <InputField
          label="BHXH"
          value={adminForm.socialInsuranceNumber}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              socialInsuranceNumber: e.target.value,
            }))
          }
        />
        <InputField
          label="Số tài khoản"
          value={adminForm.bankAccountNumber}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              bankAccountNumber: e.target.value,
            }))
          }
        />
        <InputField
          label="Ngân hàng"
          value={adminForm.bankName}
          onChange={(e) =>
            setAdminForm((p) => ({ ...p, bankName: e.target.value }))
          }
        />
        <InputField
          label="Hôn nhân"
          value={adminForm.maritalStatus}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              maritalStatus: e.target.value,
            }))
          }
        />
        <TextAreaField
          label="Ghi chú"
          value={adminForm.note}
          onChange={(e) =>
            setAdminForm((p) => ({ ...p, note: e.target.value }))
          }
          rows={2}
          className="sm:col-span-2"
        />
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow label="CCCD/CMND" value={adminInfo.identityNumber} />
        <InfoRow
          label="Ngày cấp"
          value={formatDate(adminInfo.identityIssuedDate)}
        />
        <InfoRow label="Nơi cấp" value={adminInfo.identityIssuedPlace} />
        <InfoRow label="MST" value={adminInfo.taxCode} />
        <InfoRow label="BHXH" value={adminInfo.socialInsuranceNumber} />
        <InfoRow label="Số tài khoản" value={adminInfo.bankAccountNumber} />
        <InfoRow label="Ngân hàng" value={adminInfo.bankName} />
        <InfoRow label="Hôn nhân" value={adminInfo.maritalStatus} />
        <InfoRow label="Ghi chú" value={adminInfo.note} />
      </div>
    )}
  </Card>
);

export default EmployeeDetailAdminSection;
