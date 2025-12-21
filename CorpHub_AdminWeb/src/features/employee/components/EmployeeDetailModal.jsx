import React, { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
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
  X,
} from "lucide-react";
import { getEmployeeFullDetail } from "../services/employeeApi";

const EmployeeDetailModal = ({ selectedId, initialEmployee, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getEmployeeFullDetail(selectedId);
      setDetail(res.data?.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load employee info");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (!selectedId) return null;

  const profile = detail || initialEmployee || {};
  const adminInfo = profile.administrativeInfo || {};
  const competencies = profile.competencies || [];
  const documents = profile.documents || [];
  const histories = profile.internalHistories || [];
  const positionRequests = profile.positionChangeRequests || [];

  const formatDate = (value, options) =>
    value ? new Date(value).toLocaleDateString("en-US", options) : "—";

  const avatarSrc = profile.avatarUrl
    ? profile.avatarUrl
    : profile.fullName
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}`
    : "https://ui-avatars.com/api/?background=0D8ABC&color=fff";

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 px-2 py-6 sm:px-6">
      <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-gray-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/80 p-2 text-gray-600 shadow hover:bg-white focus:outline-none"
        >
          <X size={18} />
        </button>

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
                    Code: {profile.code}
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
                    {profile.active ? "Active" : "Inactive"}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-white/90">
                {profile.positionName || "No position"} ·{" "}
                {profile.departmentName || "No department"}
              </p>
              {profile.managerName && (
                <p className="text-xs text-white/80">
                  Manager: {profile.managerName}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative h-[85vh] overflow-hidden bg-gray-50 dark:bg-gray-950">
          <div className="flex h-full flex-col lg:flex-row">
            <div className="relative flex-1 overflow-y-auto p-6">
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-gray-900/70">
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow dark:bg-gray-800 dark:text-gray-100">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading details...
                  </div>
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
                    Retry
                  </button>
                </div>
              )}

              <div
                className="grid grid-cols-1 gap-6 xl:grid-cols-3"
                id="personal"
              >
                <section className="xl:col-span-2 space-y-6">
                  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Personal information
                      </h4>
                      <span className="text-xs text-gray-500">
                        Joined: {formatDate(profile.joinDate)}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoItem
                        icon={<Mail size={16} />}
                        label="Personal email"
                        value={profile.personalEmail}
                      />
                      <InfoItem
                        icon={<Phone size={16} />}
                        label="Phone number"
                        value={profile.phone}
                      />
                      <InfoItem
                        icon={<UserRound size={16} />}
                        label="Gender"
                        value={profile.gender}
                      />
                      <InfoItem
                        icon={<Calendar size={16} />}
                        label="Date of birth"
                        value={formatDate(profile.dob)}
                      />
                      <InfoItem
                        icon={<MapPin size={16} />}
                        label="Address"
                        value={profile.address}
                      />
                      <InfoItem
                        icon={<AtSign size={16} />}
                        label="Work email"
                        value={profile.workEmail || profile.personalEmail}
                      />
                    </div>
                    {profile.about && (
                      <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {profile.about}
                      </p>
                    )}
                  </div>

                  <div
                    className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900"
                    id="job"
                  >
                    <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <Building2 size={18} /> Job information
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InfoItem
                        icon={<BadgeCheck size={16} />}
                        label="Position"
                        value={profile.positionName}
                      />
                      <InfoItem
                        icon={<Building2 size={16} />}
                        label="Department"
                        value={profile.departmentName}
                      />
                      <InfoItem
                        icon={<ShieldCheck size={16} />}
                        label="Manager"
                        value={profile.managerName}
                      />
                      <InfoItem
                        icon={<Calendar size={16} />}
                        label="Start date"
                        value={formatDate(profile.joinDate)}
                      />
                    </div>
                  </div>

                  <div
                    className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900"
                    id="competency"
                  >
                    <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <Award size={18} /> Competencies
                    </div>
                    {competencies.length === 0 ? (
                      <EmptyState label="No competencies yet" />
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
                                {c.typeName || c.typeCode || "Other"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Level: {c.levelName || "—"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Issued by: {c.issuedBy || "—"}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                              <span>Issued: {formatDate(c.issuedDate)}</span>
                              <span>Expires: {formatDate(c.expireDate)}</span>
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
                  </div>

                  <div
                    className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900"
                    id="documents"
                  >
                    <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <FileText size={18} /> Documents
                    </div>
                    {documents.length === 0 ? (
                      <EmptyState label="No documents yet" />
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
                                  {doc.documentTypeName || "Document"}
                                </p>
                              </div>
                              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                                {doc.fileType || "file"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              Uploaded: {formatDate(doc.uploadDate)}
                            </p>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                              Download / Open
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-6" id="admin">
                  <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
                    <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <Banknote size={18} /> Administrative information
                    </div>
                    <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                      <InfoRow
                        label="National ID"
                        value={adminInfo.identityNumber}
                      />
                      <InfoRow
                        label="Issued date"
                        value={formatDate(adminInfo.identityIssuedDate)}
                      />
                      <InfoRow
                        label="Place of issue"
                        value={adminInfo.identityIssuedPlace}
                      />
                      <InfoRow label="Tax code" value={adminInfo.taxCode} />
                      <InfoRow
                        label="Social insurance"
                        value={adminInfo.socialInsuranceNumber}
                      />
                      <InfoRow
                        label="Bank account number"
                        value={adminInfo.bankAccountNumber}
                      />
                      <InfoRow label="Bank name" value={adminInfo.bankName} />
                      <InfoRow
                        label="Marital status"
                        value={adminInfo.maritalStatus}
                      />
                      <InfoRow label="Notes" value={adminInfo.note} />
                    </div>
                  </div>

                  <div
                    className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900"
                    id="history"
                  >
                    <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <History size={18} /> Internal history
                    </div>
                    {histories.length === 0 ? (
                      <EmptyState label="No history yet" />
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
                              Change type: {h.changeType || "—"}
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
                  </div>

                  <div
                    className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900"
                    id="requests"
                  >
                    <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                      <CheckCircle2 size={18} /> Position change requests
                    </div>
                    {positionRequests.length === 0 ? (
                      <EmptyState label="No requests yet" />
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
                              <span>Type: {r.type || "—"}</span>
                              <span>Effective: {formatDate(r.effectDate)}</span>
                              <span>Created: {formatDate(r.createdAt)}</span>
                              <span>Created by: {r.createdByName || "—"}</span>
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
                                    {a.fileName || "Attachment"}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
            <aside className="hidden w-56 flex-shrink-0 border-l border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900 lg:block">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Quick links
              </p>
              <nav className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                {[
                  { id: "personal", label: "Personal" },
                  { id: "job", label: "Job" },
                  { id: "competency", label: "Competency" },
                  { id: "documents", label: "Documents" },
                  { id: "admin", label: "Administrative" },
                  { id: "history", label: "History" },
                  { id: "requests", label: "Position requests" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default EmployeeDetailModal;
