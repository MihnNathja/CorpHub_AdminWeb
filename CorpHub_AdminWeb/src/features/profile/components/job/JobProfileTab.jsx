// src/features/profile/components/JobProfileTab.jsx
import { useEffect, useMemo, useState } from "react";
import Section from "../Section";
import CurrentJobSummary from "./CurrentJobSummary";
import EmploymentHistoryToolbar from "./EmploymentHistoryToolbar";
import EmploymentHistoryTable from "./EmploymentHistoryTable";
import CompetencyTable from "./competency/CompetencyTable";
import CompetencySection from "./competency/CompetencySection";
import { mockJobProfile } from "../../mockJobProfile";
import { useCompetency } from "../../hooks/useCompetency";

const JobProfileTab = ({ profiles }) => {
  const { items, getMyCompetencies } = useCompetency();

  useEffect(() => {
    getMyCompetencies();
  }, [getMyCompetencies]);

  const profile = mockJobProfile;
  // Chuẩn hoá field theo DTO backend (EmployeeProfileResponse)
  const histories = profile?.jobHistories ?? [];

  const competencies = items;

  // Suy ra vị trí/phòng ban hiện tại (endDate null/empty là đang làm)
  const current = useMemo(() => {
    if (!histories.length) return null;
    const active = histories.find((h) => !h.endDate);
    if (active) return active;
    // nếu tất cả đã kết thúc, lấy bản ghi mới nhất
    return [...histories].sort(
      (a, b) => new Date(b.startDate) - new Date(a.startDate)
    )[0];
  }, [histories]);

  // State cho lọc/sắp xếp lịch sử
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [contract, setContract] = useState("");
  const [sortKey, setSortKey] = useState("startDate"); // startDate | endDate
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const filteredHistories = useMemo(() => {
    const data = histories.filter((h) => {
      const matchesText =
        !search ||
        [h.departmentName, h.positionName, h.contractType, h.note]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesDept = !dept || h.departmentName === dept;
      const matchesContract = !contract || h.contractType === contract;
      return matchesText && matchesDept && matchesContract;
    });

    const factor = sortDir === "asc" ? 1 : -1;
    return data.sort((a, b) => {
      const va = new Date(
        a[sortKey] ?? (sortKey === "endDate" ? "1900-01-01" : "1900-01-01")
      );
      const vb = new Date(
        b[sortKey] ?? (sortKey === "endDate" ? "1900-01-01" : "1900-01-01")
      );
      return (va - vb) * factor;
    });
  }, [histories, search, dept, contract, sortKey, sortDir]);

  const deptOptions = useMemo(
    () =>
      Array.from(new Set(histories.map((h) => h.departmentName))).filter(
        Boolean
      ),
    [histories]
  );
  const contractOptions = useMemo(
    () =>
      Array.from(new Set(histories.map((h) => h.contractType))).filter(Boolean),
    [histories]
  );

  return (
    <div className="space-y-8">
      {/* TÓM TẮT HIỆN TẠI */}
      <Section title="Thông tin công việc hiện tại">
        <CurrentJobSummary current={current} />
      </Section>

      {/* LỊCH SỬ LÀM VIỆC */}
      <Section
        title="Lịch sử làm việc"
        right={
          <EmploymentHistoryToolbar
            search={search}
            setSearch={setSearch}
            dept={dept}
            setDept={setDept}
            deptOptions={deptOptions}
            contract={contract}
            setContract={setContract}
            contractOptions={contractOptions}
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortDir={sortDir}
            setSortDir={setSortDir}
          />
        }
      >
        <EmploymentHistoryTable histories={filteredHistories} />
      </Section>

      {/* NĂNG LỰC & CHỨNG CHỈ */}
      <CompetencySection profile={profiles} competencies={competencies} />
    </div>
  );
};

export default JobProfileTab;
