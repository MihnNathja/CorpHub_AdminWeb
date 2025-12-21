// src/features/profile/components/job/CurrentJobSummary.jsx
import { Briefcase, Building2, CalendarDays, ShieldCheck } from "lucide-react";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "Present");

const Badge = ({ color = "blue", children }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full bg-${color}-100 text-${color}-700`}
  >
    {children}
  </span>
);

// Lưu ý: với Tailwind dạng lớp động bg-${color}-100 có thể cần safelist.
// Nếu bạn có strict purge, thay bằng các lớp cố định (bg-green-100 ...)

const CurrentJobSummary = ({ current }) => {
  if (!current) {
    return (
      <div className="text-sm text-gray-500 italic">
        Chưa có dữ liệu công tác.
      </div>
    );
  }

  const status = !current.endDate ? (
    <Badge color="green">Working</Badge>
  ) : (
    <Badge color="gray">Ended</Badge>
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="p-4 border rounded-xl">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Briefcase size={16} />
          <span className="text-xs uppercase">Position</span>
        </div>
        <div className="font-medium">{current.positionName || "-"}</div>
      </div>

      <div className="p-4 border rounded-xl">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <Building2 size={16} />
          <span className="text-xs uppercase">Department</span>
        </div>
        <div className="font-medium">{current.departmentName || "-"}</div>
      </div>

      <div className="p-4 border rounded-xl">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <ShieldCheck size={16} />
          <span className="text-xs uppercase">Contract type</span>
        </div>
        <div className="font-medium">{current.contractType || "-"}</div>
      </div>

      <div className="p-4 border rounded-xl md:col-span-3">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <CalendarDays size={16} />
          <span className="text-xs uppercase">Thời gian</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span>
            Start: <b>{fmt(current.startDate)}</b>
          </span>
          <span className="text-gray-400">•</span>
          <span>
            End: <b>{fmt(current.endDate)}</b>
          </span>
          <span className="ml-3">{status}</span>
        </div>
        {current.note && (
          <div className="text-sm text-gray-600 mt-2">Note: {current.note}</div>
        )}
      </div>
    </div>
  );
};

export default CurrentJobSummary;
