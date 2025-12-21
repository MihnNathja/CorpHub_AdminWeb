import React from "react";
import { Building2 } from "lucide-react";
import { Card } from "./EmployeeDetailCard";
import { InputField, InfoRow } from "./EmployeeDetailFields";

const EmployeeDetailJobSection = ({ profile, onCreateRequest, formatDate }) => (
  <Card
    title="Job information"
    icon={<Building2 size={18} />}
    actions={
      <button
        type="button"
        onClick={onCreateRequest}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-200 dark:hover:bg-indigo-900/40"
      >
        Create position change request
      </button>
    }
  >
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <InfoRow label="Position" value={profile.positionName} />
      <InfoRow label="Department" value={profile.departmentName} />
      <InfoRow label="Manager" value={profile.managerName} />
      <InfoRow label="Join date" value={formatDate(profile.joinDate)} />
    </div>
    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
      Role/department changes are processed via position change requests.
      Managers cannot edit directly here.
    </p>
  </Card>
);

export default EmployeeDetailJobSection;
