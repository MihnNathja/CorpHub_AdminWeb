// src/features/profile/components/job/EmploymentHistoryTable.jsx
const fmt = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "Hiện tại");

const StatusPill = ({ text }) => {
  const isActive = (text || "").toLowerCase().includes("đang");
  const cls = isActive
    ? "bg-green-100 text-green-700"
    : "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${cls}`}>
      {text || "-"}
    </span>
  );
};

const EmploymentHistoryTable = ({ histories }) => {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-2 border">Phòng ban</th>
            <th className="p-2 border">Chức vụ</th>
            <th className="p-2 border">Loại hợp đồng</th>
            <th className="p-2 border">Ngày bắt đầu</th>
            <th className="p-2 border">Ngày kết thúc</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {!histories?.length ? (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                Chưa có dữ liệu công tác
              </td>
            </tr>
          ) : (
            histories.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                <td className="p-2 border">
                  {job.departmentName || job.department || "-"}
                </td>
                <td className="p-2 border">
                  {job.positionName || job.position || "-"}
                </td>
                <td className="p-2 border">{job.contractType || "-"}</td>
                <td className="p-2 border">{fmt(job.startDate)}</td>
                <td className="p-2 border">{fmt(job.endDate)}</td>
                <td className="p-2 border">
                  <StatusPill
                    text={
                      job.employmentStatus ||
                      (!job.endDate ? "Đang làm việc" : "Đã kết thúc")
                    }
                  />
                </td>
                <td className="p-2 border">{job.note || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmploymentHistoryTable;
