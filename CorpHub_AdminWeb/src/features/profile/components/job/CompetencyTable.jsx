// src/features/profile/components/job/CompetencyTable.jsx
const fmt = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

const CompetencyTable = ({ items }) => {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-2 border">Loại</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Trình độ</th>
            <th className="p-2 border">Cấp bởi</th>
            <th className="p-2 border">Ngày cấp</th>
            <th className="p-2 border">Ngày hết hạn</th>
            <th className="p-2 border">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {items?.length ? (
            items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                <td className="p-2 border">{c.type || "-"}</td>
                <td className="p-2 border">{c.name || "-"}</td>
                <td className="p-2 border">{c.level || "-"}</td>
                <td className="p-2 border">{c.issuedBy || "-"}</td>
                <td className="p-2 border">{fmt(c.issuedDate)}</td>
                <td className="p-2 border">{fmt(c.expireDate)}</td>
                <td className="p-2 border">{c.note || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4 text-gray-500">
                Chưa có năng lực hoặc chứng chỉ nào được ghi nhận
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompetencyTable;
