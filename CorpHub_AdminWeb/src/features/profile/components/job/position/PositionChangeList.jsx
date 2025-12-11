import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Clock3,
  Eye,
  Plus,
  Rows,
} from "lucide-react";
import Button from "../../../../global/components/button/Button";
import { usePositionChangeRequest } from "../../../hooks/usePositionChangeRequest";
import PositionChangeCreateModal from "./PositionChangeCreateModal";
import PositionChangeRequestDetailModal from "./PositionChangeRequestDetailModal";

const STATUS_STYLES = {
  PENDING: {
    label: "Chờ duyệt",
    chip: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  APPROVED: {
    label: "Đã duyệt",
    chip: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  REJECTED: {
    label: "Từ chối",
    chip: "bg-rose-100 text-rose-700 border border-rose-200",
  },
  CANCELLED: {
    label: "Đã hủy",
    chip: "bg-slate-100 text-slate-700 border border-slate-200",
  },
};

const TYPE_LABELS = {
  PROMOTION: "Thăng chức",
  TRANSFER: "Điều chuyển",
  DEMOTION: "Giáng chức",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "-";

const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
    <div className="flex items-center justify-between gap-3">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="h-6 w-16 rounded-full bg-slate-200" />
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
      <div className="h-14 rounded-lg bg-slate-200" />
      <div className="hidden h-10 w-10 rounded-full bg-slate-200 md:block" />
      <div className="h-14 rounded-lg bg-slate-200" />
    </div>
    <div className="mt-4 flex flex-wrap gap-3">
      <div className="h-6 w-28 rounded bg-slate-200" />
      <div className="h-6 w-24 rounded bg-slate-200" />
      <div className="h-6 w-24 rounded bg-slate-200" />
    </div>
  </div>
);

const PositionChangeList = ({ employeeId }) => {
  const {
    items,
    getRequestsByEmployee,
    loading,
    getRequestDetail,
    getApprovalSteps,
  } = usePositionChangeRequest();

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoadingId, setDetailLoadingId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const sortedList = useMemo(() => {
    return [...list].sort((a, b) => {
      const aTime = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [list]);

  const latest = sortedList[0];
  const remaining = sortedList.slice(1);

  useEffect(() => {
    if (employeeId) {
      getRequestsByEmployee(employeeId);
    }
  }, [employeeId]);

  const handleOpenDetail = async (requestId) => {
    if (!requestId) return;
    setDetailLoadingId(requestId);
    try {
      const [detail, approvalSteps] = await Promise.all([
        getRequestDetail(requestId),
        getApprovalSteps(requestId),
      ]);
      setSelectedRequest({ ...detail, approvalSteps });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Không thể tải chi tiết yêu cầu", err);
    } finally {
      setDetailLoadingId(null);
    }
  };

  const renderCard = (req, { isPrimary = false } = {}) => {
    const statusKey = (req.status || "PENDING").toUpperCase();
    const statusMeta = STATUS_STYLES[statusKey] || STATUS_STYLES.CANCELLED;
    const typeLabel = TYPE_LABELS[req.type] || req.type || "Khác";

    return (
      <div
        key={req.id}
        className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
          isPrimary
            ? "border-blue-200 ring-1 ring-blue-100 bg-gradient-to-br from-white to-blue-50"
            : "border-slate-200"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.chip}`}
            >
              <Clock3 size={14} /> {statusMeta.label}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {typeLabel}
            </span>
            {isPrimary && (
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                Gần nhất
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Mã yêu cầu:</span>
            <span className="font-semibold text-slate-700">
              {req.id?.slice(0, 10) || "-"}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vị trí hiện tại
            </p>
            <p className="text-base font-semibold text-slate-900">
              {req.oldPositionName || "-"}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {req.oldDepartmentName || "-"}
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center text-slate-400">
            <ArrowRight size={22} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Vị trí đề xuất
            </p>
            <p className="text-base font-semibold text-slate-900">
              {req.newPositionName || "-"}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              {req.newDepartmentName || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1">
            <CalendarClock size={16} className="text-blue-600" />
            <span>Hiệu lực: {formatDate(req.effectDate)}</span>
          </div>
          {req.createdAt && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1">
              <Clock3 size={16} className="text-slate-500" />
              <span>Tạo lúc: {formatDate(req.createdAt)}</span>
            </div>
          )}
          {req.createdByName && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1">
              <span className="font-semibold text-slate-800">Người tạo:</span>
              <span>{req.createdByName}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 line-clamp-2">
            {req.reason || "Không có mô tả"}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              color="blue"
              size="sm"
              onClick={() => handleOpenDetail(req.id)}
              loading={detailLoadingId === req.id}
              icon={<Eye size={16} />}
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Hồ sơ nhân sự</p>
          <h3 className="text-xl font-bold text-slate-900">
            Yêu cầu thay đổi chức danh
          </h3>
        </div>
        <Button
          onClick={() => setOpenCreate(true)}
          icon={<Plus size={16} />}
          color="blue"
        >
          Tạo yêu cầu mới
        </Button>
      </div>

      <div className="mt-5 space-y-3">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && sortedList.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-slate-500">
            <Clock3 className="h-6 w-6" />
            <p className="text-sm font-semibold">Chưa có yêu cầu nào</p>
            <p className="text-xs text-slate-400">
              Bấm "Tạo yêu cầu mới" để bắt đầu quy trình thay đổi chức danh.
            </p>
          </div>
        )}

        {!loading && latest && renderCard(latest, { isPrimary: true })}

        {!loading && remaining.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Rows size={16} className="text-slate-500" />
                {showAll
                  ? "Các yêu cầu trước đó"
                  : `Ẩn ${remaining.length} yêu cầu cũ hơn`}
              </div>
              <Button
                size="sm"
                variant="outline"
                color="gray"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "Thu gọn" : "Hiển thị tất cả"}
              </Button>
            </div>

            {showAll && (
              <div className="mt-3 space-y-3">
                {remaining.map((req) => renderCard(req))}
              </div>
            )}
          </div>
        )}
      </div>

      {openCreate && (
        <PositionChangeCreateModal
          employeeId={employeeId}
          onClose={() => setOpenCreate(false)}
          onCreated={() => employeeId && getRequestsByEmployee(employeeId)}
        />
      )}

      {selectedRequest && (
        <PositionChangeRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default PositionChangeList;
