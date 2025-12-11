import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  FileText,
  History,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  getEmployeeFullDetail,
  updateEmployeeAdministrativeInfo,
  updateEmployeeBasicInfo,
  updateEmployeeContactInfo,
} from "../services/employeeApi";
import { showSuccess, showError } from "../../../utils/toastUtils";
import { Card } from "../components/EmployeeDetailCard";
import { EmptyState } from "../components/EmployeeDetailFields";
import EmployeeDetailBasicSection from "../components/EmployeeDetailBasicSection";
import EmployeeDetailContactSection from "../components/EmployeeDetailContactSection";
import EmployeeDetailAdminSection from "../components/EmployeeDetailAdminSection";
import EmployeeDetailJobSection from "../components/EmployeeDetailJobSection";
import { useDocument } from "../../profile/hooks/useDocument";
import PositionChangeCreateModal from "../../profile/components/job/position/PositionChangeCreateModal";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(false);
  const [showPositionChangeModal, setShowPositionChangeModal] = useState(false);

  const [basicForm, setBasicForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
  });
  const [contactForm, setContactForm] = useState({
    personalEmail: "",
    phone: "",
    address: "",
    about: "",
  });

  const [adminForm, setAdminForm] = useState({
    identityNumber: "",
    identityIssuedDate: "",
    identityIssuedPlace: "",
    taxCode: "",
    socialInsuranceNumber: "",
    bankAccountNumber: "",
    bankName: "",
    maritalStatus: "",
    note: "",
  });

  const profile = detail || {};
  const adminInfo = profile.administrativeInfo || {};
  const competencies = profile.competencies || [];
  const documents = profile.documents || [];
  const histories = profile.internalHistories || [];
  const positionRequests = profile.positionChangeRequests || [];

  const { downloadDocument, downloadingIds } = useDocument();

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

  useEffect(() => {
    if (!detail) return;
    resetBasicForm(detail);
    resetContactForm(detail);
    resetAdminForm(adminInfo);
    setEditingBasic(false);
    setEditingContact(false);
    setEditingAdmin(false);
  }, [detail]);

  const resetBasicForm = (source) => {
    const payload = source || profile;
    setBasicForm({
      fullName: payload.fullName || "",
      dob: payload.dob || "",
      gender: payload.gender || "",
    });
  };

  const resetContactForm = (source) => {
    const payload = source || profile;
    setContactForm({
      personalEmail: payload.personalEmail || "",
      phone: payload.phone || "",
      address: payload.address || "",
      about: payload.about || "",
    });
  };

  const resetAdminForm = (source) => {
    const payload = source || adminInfo;
    setAdminForm({
      identityNumber: payload.identityNumber || "",
      identityIssuedDate: payload.identityIssuedDate || "",
      identityIssuedPlace: payload.identityIssuedPlace || "",
      taxCode: payload.taxCode || "",
      socialInsuranceNumber: payload.socialInsuranceNumber || "",
      bankAccountNumber: payload.bankAccountNumber || "",
      bankName: payload.bankName || "",
      maritalStatus: payload.maritalStatus || "",
      note: payload.note || "",
    });
  };

  const handleSaveBasic = async () => {
    try {
      setSavingBasic(true);
      const payload = { ...basicForm };
      const res = await updateEmployeeBasicInfo(id, payload);
      const basic = res.data?.data || res.data;
      setDetail((prev) => ({
        ...prev,
        ...basic,
      }));
      showSuccess("Cập nhật thông tin cơ bản thành công");
      setEditingBasic(false);
    } catch (e) {
      showError(
        e.response?.data?.message || "Cập nhật thông tin cơ bản thất bại"
      );
    } finally {
      setSavingBasic(false);
    }
  };

  const handleCreatePositionRequest = () => {
    setShowPositionChangeModal(true);
  };

  const handleSaveContact = async () => {
    try {
      setSavingContact(true);
      const res = await updateEmployeeContactInfo(id, contactForm);
      const contact = res.data?.data || res.data;
      setDetail((prev) => ({
        ...prev,
        ...contact,
      }));
      showSuccess("Cập nhật liên hệ thành công");
      setEditingContact(false);
    } catch (e) {
      showError(e.response?.data?.message || "Cập nhật liên hệ thất bại");
    } finally {
      setSavingContact(false);
    }
  };

  const handleSaveAdmin = async () => {
    try {
      setSavingAdmin(true);
      const res = await updateEmployeeAdministrativeInfo(id, adminForm);
      const admin = res.data?.data || res.data;
      setDetail((prev) => ({
        ...prev,
        administrativeInfo: {
          ...(prev?.administrativeInfo || {}),
          ...admin,
        },
      }));
      showSuccess("Cập nhật hành chính thành công");
      setEditingAdmin(false);
    } catch (e) {
      showError(e.response?.data?.message || "Cập nhật hành chính thất bại");
    } finally {
      setSavingAdmin(false);
    }
  };

  const formatDate = (value, options) =>
    value ? new Date(value).toLocaleDateString("vi-VN", options) : "—";

  const avatarSrc = profile.avatarUrl
    ? profile.avatarUrl
    : profile.fullName
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}`
    : "https://ui-avatars.com/api/?background=0D8ABC&color=fff";

  console.log(profile);
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
              <EmployeeDetailBasicSection
                profile={profile}
                basicForm={basicForm}
                setBasicForm={setBasicForm}
                editing={editingBasic}
                setEditing={setEditingBasic}
                saving={savingBasic}
                onSave={handleSaveBasic}
                onCancel={() => {
                  resetBasicForm();
                  setEditingBasic(false);
                }}
                formatDate={formatDate}
              />

              <EmployeeDetailJobSection
                profile={profile}
                onCreateRequest={handleCreatePositionRequest}
                formatDate={formatDate}
              />

              <EmployeeDetailContactSection
                profile={profile}
                contactForm={contactForm}
                setContactForm={setContactForm}
                editing={editingContact}
                setEditing={setEditingContact}
                saving={savingContact}
                onSave={handleSaveContact}
                onCancel={() => {
                  resetContactForm();
                  setEditingContact(false);
                }}
              />

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
                        <button
                          type="button"
                          onClick={() => {
                            console.log(doc);
                            downloadDocument(doc.id || doc.documentId);
                          }}
                          disabled={downloadingIds?.includes(
                            doc.id || doc.documentId
                          )}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
                        >
                          {downloadingIds?.includes(doc.id || doc.documentId)
                            ? "Đang tải..."
                            : "Tải / mở"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            <section className="space-y-6" id="admin">
              <EmployeeDetailAdminSection
                adminInfo={adminInfo}
                adminForm={adminForm}
                setAdminForm={setAdminForm}
                editing={editingAdmin}
                setEditing={setEditingAdmin}
                saving={savingAdmin}
                onSave={handleSaveAdmin}
                onCancel={() => {
                  resetAdminForm();
                  setEditingAdmin(false);
                }}
                formatDate={formatDate}
              />

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

      {showPositionChangeModal && (
        <PositionChangeCreateModal
          employeeId={id}
          onClose={() => setShowPositionChangeModal(false)}
          onCreated={() => {
            setShowPositionChangeModal(false);
            fetchDetail();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDetailPage;
