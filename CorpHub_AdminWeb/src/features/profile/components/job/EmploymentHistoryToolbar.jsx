// src/features/profile/components/job/EmploymentHistoryToolbar.jsx
import { ArrowUpDown } from "lucide-react";

const EmploymentHistoryToolbar = ({
  search,
  setSearch,
  dept,
  setDept,
  deptOptions = [],
  contract,
  setContract,
  contractOptions = [],
  sortKey,
  setSortKey,
  sortDir,
  setSortDir,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Tìm phòng ban, chức vụ, ghi chú..."
        className="border rounded-xl px-3 py-1.5 text-sm w-full md:w-64"
      />

      <select
        value={dept}
        onChange={(e) => setDept(e.target.value)}
        className="border rounded-xl px-3 py-1.5 text-sm"
      >
        <option value="">Phòng ban (tất cả)</option>
        {deptOptions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <select
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        className="border rounded-xl px-3 py-1.5 text-sm"
      >
        <option value="">Hợp đồng (tất cả)</option>
        {contractOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border rounded-xl px-3 py-1.5 text-sm"
        >
          <option value="startDate">Sắp xếp theo ngày bắt đầu</option>
          <option value="endDate">Sắp xếp theo ngày kết thúc</option>
        </select>

        <button
          onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          className="px-3 py-1.5 text-sm border rounded-xl hover:bg-gray-50 flex items-center gap-1"
          title="Đảo chiều sắp xếp"
        >
          <ArrowUpDown size={14} />{" "}
          {sortDir === "asc" ? "Tăng dần" : "Giảm dần"}
        </button>
      </div>
    </div>
  );
};

export default EmploymentHistoryToolbar;
