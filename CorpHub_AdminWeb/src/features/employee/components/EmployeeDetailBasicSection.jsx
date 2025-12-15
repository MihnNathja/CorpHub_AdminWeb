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
    title="Personal information"
    subtitle={`Joined: ${formatDate(profile.joinDate)}`}
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
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InputField
          label="Full name"
          value={basicForm.fullName}
          onChange={(e) =>
            setBasicForm((p) => ({
              ...p,
              fullName: e.target.value,
            }))
          }
        />
        <InputField
          label="Date of birth"
          type="date"
          value={basicForm.dob ? basicForm.dob.slice(0, 10) : ""}
          onChange={(e) => setBasicForm((p) => ({ ...p, dob: e.target.value }))}
        />
        <SelectField
          label="Gender"
          value={basicForm.gender || ""}
          onChange={(e) =>
            setBasicForm((p) => ({ ...p, gender: e.target.value }))
          }
          options={[
            { value: "", label: "-- Select --" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        <InputField
          label="Join date"
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
        <InfoRow label="Full name" value={profile.fullName} />
        <InfoRow label="Date of birth" value={formatDate(profile.dob)} />
        <InfoRow label="Gender" value={profile.gender} />
        <InfoRow label="Join date" value={formatDate(profile.joinDate)} />
      </div>
    )}
  </Card>
);

export default EmployeeDetailBasicSection;
