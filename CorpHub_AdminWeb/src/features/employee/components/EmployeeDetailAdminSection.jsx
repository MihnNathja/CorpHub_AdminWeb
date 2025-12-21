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
    title="Administrative information"
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
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30"
        >
          Edit
        </button>
      )
    }
  >
    {editing ? (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="National ID"
          value={adminForm.identityNumber}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              identityNumber: e.target.value,
            }))
          }
        />
        <InputField
          label="Issued date"
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
          label="Place of issue"
          value={adminForm.identityIssuedPlace}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              identityIssuedPlace: e.target.value,
            }))
          }
        />
        <InputField
          label="Tax code"
          value={adminForm.taxCode}
          onChange={(e) =>
            setAdminForm((p) => ({ ...p, taxCode: e.target.value }))
          }
        />
        <InputField
          label="Social insurance"
          value={adminForm.socialInsuranceNumber}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              socialInsuranceNumber: e.target.value,
            }))
          }
        />
        <InputField
          label="Bank account number"
          value={adminForm.bankAccountNumber}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              bankAccountNumber: e.target.value,
            }))
          }
        />
        <InputField
          label="Bank name"
          value={adminForm.bankName}
          onChange={(e) =>
            setAdminForm((p) => ({ ...p, bankName: e.target.value }))
          }
        />
        <InputField
          label="Marital status"
          value={adminForm.maritalStatus}
          onChange={(e) =>
            setAdminForm((p) => ({
              ...p,
              maritalStatus: e.target.value,
            }))
          }
        />
        <TextAreaField
          label="Notes"
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
        <InfoRow label="National ID" value={adminInfo.identityNumber} />
        <InfoRow
          label="Issued date"
          value={formatDate(adminInfo.identityIssuedDate)}
        />
        <InfoRow label="Place of issue" value={adminInfo.identityIssuedPlace} />
        <InfoRow label="Tax code" value={adminInfo.taxCode} />
        <InfoRow
          label="Social insurance"
          value={adminInfo.socialInsuranceNumber}
        />
        <InfoRow
          label="Bank account number"
          value={adminInfo.bankAccountNumber}
        />
        <InfoRow label="Bank name" value={adminInfo.bankName} />
        <InfoRow label="Marital status" value={adminInfo.maritalStatus} />
        <InfoRow label="Notes" value={adminInfo.note} />
      </div>
    )}
  </Card>
);

export default EmployeeDetailAdminSection;
