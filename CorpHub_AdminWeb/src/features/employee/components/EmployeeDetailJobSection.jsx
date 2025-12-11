import React from "react";
import { Building2 } from "lucide-react";
import { Card } from "./EmployeeDetailCard";
import { InputField, InfoRow } from "./EmployeeDetailFields";

const EmployeeDetailJobSection = ({ profile, onCreateRequest, formatDate }) => (
  <Card
    title="Thông tin công việc"
    icon={<Building2 size={18} />}
    actions={
      <button
        type="button"
        onClick={onCreateRequest}
        className="rounded-lg px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 dark:text-indigo-200 dark:hover:bg-indigo-900/40"
      >
        Tạo yêu cầu thay đổi chức danh
      </button>
    }
  >
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <InfoRow label="Vị trí" value={profile.positionName} />
      <InfoRow label="Phòng ban" value={profile.departmentName} />
      <InfoRow label="Quản lý" value={profile.managerName} />
      <InfoRow label="Ngày vào làm" value={formatDate(profile.joinDate)} />
    </div>
    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
      Thay đổi chức danh/phòng ban sẽ được thực hiện thông qua yêu cầu thay đổi
      chức danh. Quản lý không thể chỉnh sửa trực tiếp tại đây.
    </p>
  </Card>
);

export default EmployeeDetailJobSection;
