import Section from "./Section";

const JobProfileTab = ({ profile }) => (
  <div className="divide-y">
    <Section title="Kỹ năng">
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((s) => (
          <span
            key={s}
            className="px-3 py-1 rounded-xl border text-sm bg-gray-50"
          >
            {s}
          </span>
        ))}
      </div>
    </Section>

    {/* ========== LỊCH SỬ LÀM VIỆC ========== */}
    <Section title="Lịch sử làm việc">
      <div className="overflow-x-auto">
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
            {profile.jobHistory.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="p-2 border">{job.department}</td>
                <td className="p-2 border">{job.position}</td>
                <td className="p-2 border">{job.contractType}</td>
                <td className="p-2 border">{job.startDate}</td>
                <td className="p-2 border">{job.endDate || "Hiện tại"}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      job.employmentStatus === "Đang làm việc"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {job.employmentStatus}
                  </span>
                </td>
                <td className="p-2 border">{job.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>

    {/* ========== CHỨNG CHỈ VÀ KỸ NĂNG ========== */}
    <Section title="Chứng chỉ & Kỹ năng">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2 border">Loại</th>
              <th className="p-2 border">Tên</th>
              <th className="p-2 border">Trình độ</th>
              <th className="p-2 border">Cấp bởi</th>
              <th className="p-2 border">Ngày cấp</th>
              <th className="p-2 border">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {profile.competencies.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-2 border">{c.type}</td>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.level}</td>
                <td className="p-2 border">{c.issuedBy}</td>
                <td className="p-2 border">{c.issuedDate}</td>
                <td className="p-2 border">{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  </div>
);

export default JobProfileTab;
