// src/features/profile/components/JobProfileTab.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import Section from "../Section";
import CurrentJobSummary from "./CurrentJobSummary";
import EmploymentHistoryToolbar from "./EmploymentHistoryToolbar";
import EmploymentHistoryTable from "./EmploymentHistoryTable";
import CompetencyTable from "./competency/CompetencyTable";
import CompetencySection from "./competency/CompetencySection";
import { mockJobProfile } from "../../mockJobProfile";
import { useCompetency } from "../../hooks/useCompetency";
import { useInternalWorkHistory } from "../../hooks/useInternalWorkHistory";
import PositionChangeList from "./position/PositionChangeList";
import PositionChangeRequestDetailModal from "./position/PositionChangeRequestDetailModal";
import { usePositionChangeRequest } from "../../hooks/usePositionChangeRequest";
import { showError } from "../../../../utils/toastUtils";

const JobProfileTab = ({ profiles }) => {
  const { items, getMyCompetencies } = useCompetency();
  const { histories, loading, getHistoriesByEmployee } =
    useInternalWorkHistory();
  const { getRequestDetail, getApprovalSteps } = usePositionChangeRequest();

  useEffect(() => {
    getMyCompetencies();
  }, [getMyCompetencies]);

  // Load Internal Work History khi có employeeId
  useEffect(() => {
    if (profiles?.id) {
      getHistoriesByEmployee(profiles.id);
    }
  }, [profiles?.id, getHistoriesByEmployee]);

  const competencies = items;

  // Suy ra vị trí/phòng ban hiện tại từ lịch sử mới nhất
  const current = useMemo(() => {
    if (!histories.length) return null;
    // Lấy bản ghi mới nhất theo effectiveDate
    return [...histories].sort(
      (a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate)
    )[0];
  }, [histories]);

  // State cho lọc/sắp xếp lịch sử
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [changeType, setChangeType] = useState("");
  const [sortKey, setSortKey] = useState("effectiveDate");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loadingRequestDetail, setLoadingRequestDetail] = useState(false);

  const filteredHistories = useMemo(() => {
    const data = histories.filter((h) => {
      const matchesText =
        !search ||
        [h.departmentName, h.positionName, h.reason, h.changeType]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesDept = !dept || h.departmentName === dept;
      const matchesChangeType = !changeType || h.changeType === changeType;
      return matchesText && matchesDept && matchesChangeType;
    });

    const factor = sortDir === "asc" ? 1 : -1;
    return data.sort((a, b) => {
      const va = new Date(a[sortKey] ?? "1900-01-01");
      const vb = new Date(b[sortKey] ?? "1900-01-01");
      return (va - vb) * factor;
    });
  }, [histories, search, dept, changeType, sortKey, sortDir]);

  const deptOptions = useMemo(
    () =>
      Array.from(new Set(histories.map((h) => h.departmentName))).filter(
        Boolean
      ),
    [histories]
  );

  const changeTypeOptions = useMemo(
    () =>
      Array.from(new Set(histories.map((h) => h.changeType))).filter(Boolean),
    [histories]
  );

  // Handler cho việc xem yêu cầu
  const handleViewRequest = useCallback(
    async (requestId) => {
      if (!requestId) return;

      setLoadingRequestDetail(true);
      try {
        const detail = await getRequestDetail(requestId);
        const steps = await getApprovalSteps(requestId);
        setSelectedRequest({ ...detail, approvalSteps: steps });
      } catch (err) {
        console.error(err);
        showError("Không thể tải chi tiết yêu cầu");
      } finally {
        setLoadingRequestDetail(false);
      }
    },
    [getApprovalSteps, getRequestDetail]
  );

  return (
    <div className="space-y-8">
      {/* TÓM TẮT HIỆN TẠI */}
      <Section title="Thông tin công việc hiện tại">
        <CurrentJobSummary current={current} />
      </Section>

      {/* LỊCH SỬ LÀM VIỆC */}
      <Section
        title="Lịch sử làm việc nội bộ"
        right={
          <EmploymentHistoryToolbar
            search={search}
            setSearch={setSearch}
            dept={dept}
            setDept={setDept}
            deptOptions={deptOptions}
            contract={changeType}
            setContract={setChangeType}
            contractOptions={changeTypeOptions}
            sortKey={sortKey}
            setSortKey={setSortKey}
            sortDir={sortDir}
            setSortDir={setSortDir}
          />
        }
      >
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : (
          <EmploymentHistoryTable
            histories={filteredHistories}
            onViewRequest={handleViewRequest}
          />
        )}
      </Section>

      {loadingRequestDetail && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Đang tải chi tiết yêu cầu...
        </p>
      )}

      {selectedRequest && (
        <PositionChangeRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      <div className="mt-6">
        <PositionChangeList employeeId={profiles.id} />
      </div>

      {/* NĂNG LỰC & CHỨNG CHỈ */}
      <CompetencySection profile={profiles} competencies={competencies} />
    </div>
  );
};

export default JobProfileTab;
