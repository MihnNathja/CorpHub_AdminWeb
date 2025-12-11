import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BadgeCheck,
  Banknote,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  History,
  Loader2,
  Mail,
  MapPin,
  AtSign,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { getEmployeeFullDetail } from "../services/employeeApi";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployeeFullDetail(id);
      setDetail(res.data?.data || res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể tải thông tin nhân viên"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const profile = detail || {};
  const adminInfo = profile.administrativeInfo || {};
  const competencies = profile.competencies || [];
  const documents = profile.documents || [];
  const histories = profile.internalHistories || [];
  const positionRequests = profile.positionChangeRequests || [];

  const formatDate = (value, options) =>
    value ? new Date(value).toLocaleDateString("vi-VN", options) : "—";

  const avatarSrc = profile.avatarUrl
    ? profile.avatarUrl
    : profile.fullName
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}`
    : "https://ui-avatars.com/api/?background=0D8ABC&color=fff";

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Employee Detail
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-900">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <img
              src={avatarSrc}
              alt={profile.fullName || "Avatar"}
              className="h-20 w-20 rounded-2xl border-4 border-white/40 object-cover shadow-lg"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold">{profile.fullName}</h3>
                {profile.code && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                    Mã: {profile.code}
                  </span>
                )}
                {profile.active !== undefined && (
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      profile.active
                        ? "bg-green-500/30 text-white"
                        : "bg-red-500/30 text-white"
                    }`}
                  >
                    <ShieldCheck size={14} />
                    {profile.active ? "Đang làm" : "Ngưng"}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-white/90">
                {profile.positionName || "Chưa có vị trí"} ·{" "}
                {profile.departmentName || "Chưa có phòng ban"}
              </p>
              {profile.managerName && (
                <p className="text-xs text-white/80">
                  Quản lý: {profile.managerName}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative bg-gray-50 p-6 dark:bg-gray-950">
          {loading && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow dark:bg-gray-800 dark:text-gray-100">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tải chi tiết...
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:bg-red-900/40 dark:text-red-200">
              <AlertCircle size={18} />
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchDetail}
                className="ml-auto text-xs font-semibold underline"
              >
                Thử lại
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3" id="personal">
            <section className="xl:col-span-2 space-y-6">
              <Card
                title="Thông tin cá nhân"
                subtitle={`Ngày vào: ${formatDate(profile.joinDate)}`}
              >
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem
                    icon={<Mail size={16} />}
                    label="Email cá nhân"
                    value={profile.personalEmail}
                  />
                  <InfoItem
                    icon={<Phone size={16} />}
                    label="Số điện thoại"
                    value={profile.phone}
                  />
                  <InfoItem
                    icon={<UserRound size={16} />}
                    label="Giới tính"
                    value={profile.gender}
                  />
                  <InfoItem
                    icon={<Calendar size={16} />}
                    label="Ngày sinh"
                    value={formatDate(profile.dob)}
                  />
                  <InfoItem
                    icon={<MapPin size={16} />}
                    label="Địa chỉ"
                    value={profile.address}
                  />
                  <InfoItem
                    icon={<AtSign size={16} />}
                    label="Email công ty"
                    value={profile.workEmail || profile.personalEmail}
                  />
                </div>
                {profile.about && (
                  <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {profile.about}
                  </p>
                )}
              </Card>

              <Card
                title="Thông tin công việc"
                icon={<Building2 size={18} />}
                id="job"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    icon={<BadgeCheck size={16} />}
                    label="Vị trí"
                    value={profile.positionName}
                  />
                  <InfoItem
                    icon={<Building2 size={16} />}
                    label="Phòng ban"
                    value={profile.departmentName}
                  />
                  <InfoItem
                    icon={<ShieldCheck size={16} />}
                    label="Quản lý"
                    value={profile.managerName}
                  />
                  <InfoItem
                    icon={<Calendar size={16} />}
                    label="Ngày bắt đầu"
                    value={formatDate(profile.joinDate)}
                  />
                </div>
              </Card>

              <Card title="Năng lực" icon={<Award size={18} />} id="competency">
                {competencies.length === 0 ? (
                  <EmptyState label="Chưa có năng lực" />
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {competencies.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {c.name}
                          </div>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                            {c.typeName || c.typeCode || "Khác"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Cấp độ: {c.levelName || "—"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Cấp bởi: {c.issuedBy || "—"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                          <span>Ngày cấp: {formatDate(c.issuedDate)}</span>
                          <span>Hết hạn: {formatDate(c.expireDate)}</span>
                        </div>
                        {c.note && (
                          <p className="mt-2 text-xs italic text-gray-500">
                            "{c.note}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card
                title="Tài liệu"
                icon={<FileText size={18} />}
                id="documents"
              >
                {documents.length === 0 ? (
                  <EmptyState label="Chưa có tài liệu" />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {doc.title || doc.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.documentTypeName || "Tài liệu"}
                            </p>
                          </div>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                            {doc.fileType || "file"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Ngày tải: {formatDate(doc.uploadDate)}
                        </p>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-blue-600 hover:underline"
                        >
                          Tải / mở
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            <section className="space-y-6" id="admin">
              <Card title="Thông tin hành chính" icon={<Banknote size={18} />}>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <InfoRow label="CCCD/CMND" value={adminInfo.identityNumber} />
                  <InfoRow
                    label="Ngày cấp"
                    value={formatDate(adminInfo.identityIssuedDate)}
                  />
                  <InfoRow
                    label="Nơi cấp"
                    value={adminInfo.identityIssuedPlace}
                  />
                  <InfoRow label="MST" value={adminInfo.taxCode} />
                  <InfoRow
                    label="BHXH"
                    value={adminInfo.socialInsuranceNumber}
                  />
                  <InfoRow
                    label="Số tài khoản"
                    value={adminInfo.bankAccountNumber}
                  />
                  <InfoRow label="Ngân hàng" value={adminInfo.bankName} />
                  <InfoRow label="Hôn nhân" value={adminInfo.maritalStatus} />
                  <InfoRow label="Ghi chú" value={adminInfo.note} />
                </div>
              </Card>

              <Card
                title="Lịch sử nội bộ"
                icon={<History size={18} />}
                id="history"
              >
                {histories.length === 0 ? (
                  <EmptyState label="Chưa có lịch sử" />
                ) : (
                  <div className="space-y-4">
                    {histories.map((h) => (
                      <div
                        key={h.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">
                            {h.positionName} · {h.departmentName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDate(h.effectiveDate)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Loại thay đổi: {h.changeType || "—"}
                        </p>
                        {h.reason && (
                          <p className="mt-1 text-xs italic text-gray-500">
                            "{h.reason}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card
                title="Yêu cầu thay đổi vị trí"
                icon={<CheckCircle2 size={18} />}
                id="requests"
              >
                {positionRequests.length === 0 ? (
                  <EmptyState label="Chưa có yêu cầu" />
                ) : (
                  <div className="space-y-3 text-sm">
                    {positionRequests.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                              {r.oldPositionName} → {r.newPositionName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {r.oldDepartmentName} → {r.newDepartmentName}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                            {r.status || "—"}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>Loại: {r.type || "—"}</span>
                          <span>Hiệu lực: {formatDate(r.effectDate)}</span>
                          <span>Ngày tạo: {formatDate(r.createdAt)}</span>
                          <span>Người tạo: {r.createdByName || "—"}</span>
                        </div>
                        {r.reason && (
                          <p className="mt-1 text-xs italic text-gray-500">
                            "{r.reason}"
                          </p>
                        )}
                        {r.attachments?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {r.attachments.map((a, idx) => (
                              <a
                                key={`${a.fileUrl}-${idx}`}
                                href={a.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-white px-3 py-1 text-blue-600 shadow hover:underline dark:bg-gray-800"
                              >
                                {a.fileName || "Tệp đính kèm"}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, icon, children, id }) => (
  <div id={id} className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
      {icon}
      <span>{title}</span>
      {subtitle && (
        <span className="ml-auto text-xs font-normal text-gray-500">
          {subtitle}
        </span>
      )}
    </div>
    {children}
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-800">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-gray-100">
        {value || "—"}
      </p>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-800 dark:text-gray-100">
      {value || "—"}
    </span>
  </div>
);

const EmptyState = ({ label }) => (
  <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-300">
    <AlertCircle size={16} />
    <span>{label}</span>
  </div>
);

export default EmployeeDetailPage;
