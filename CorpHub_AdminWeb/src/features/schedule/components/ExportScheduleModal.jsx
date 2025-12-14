import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  ListChecks,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

const ExportScheduleModal = ({
  defaultFrom,
  defaultTo,
  departments = [],
  users = [],
  userKeyword = "",
  setUserKeyword,
  onClose,
  onExport,
}) => {
  const [form, setForm] = useState({
    fileName: "work-schedules.xlsx",
    fromDate: defaultFrom || "",
    toDate: defaultTo || "",
    departmentId: "",
    employeeIds: [],
    format: "EXCEL",
    layout: "CALENDAR",
    includeShiftSheet: true,
    includeRawDataSheet: false,
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fromDate: defaultFrom || prev.fromDate,
      toDate: defaultTo || prev.toDate,
    }));
  }, [defaultFrom, defaultTo]);

  const candidateUsers = useMemo(() => {
    if (!userKeyword) return users;
    const keyword = userKeyword.toLowerCase();
    return users.filter((u) =>
      `${u.fullName || ""} ${u.code || ""}`.toLowerCase().includes(keyword)
    );
  }, [users, userKeyword]);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleEmployee = (employee) => {
    if (!employee?.id) return;
    if (selectedEmployees.find((e) => e.id === employee.id)) return;
    setSelectedEmployees((prev) => [...prev, employee]);
    setForm((prev) => ({
      ...prev,
      employeeIds: [...prev.employeeIds, employee.id],
    }));
    setUserKeyword("");
    setErrors((prev) => ({ ...prev, employeeIds: "" }));
  };

  const removeEmployee = (id) => {
    setSelectedEmployees((prev) => prev.filter((e) => e.id !== id));
    setForm((prev) => ({
      ...prev,
      employeeIds: prev.employeeIds.filter((empId) => empId !== id),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fromDate) newErrors.fromDate = "Chọn ngày bắt đầu";
    if (!form.toDate) newErrors.toDate = "Chọn ngày kết thúc";
    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      newErrors.toDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (!form.format) newErrors.format = "Chọn định dạng";
    if (!form.layout) newErrors.layout = "Chọn bố cục";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setExporting(true);
    setProgress(10);
    const payload = {
      ...form,
      employeeIds: selectedEmployees.map((e) => e.id),
    };

    const result = await onExport(payload, setProgress);
    setExporting(false);
    if (result?.success) {
      setProgress(100);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-white/80 uppercase tracking-wide">
                  Export
                </p>
                <h2 className="text-xl font-bold">Xuất lịch làm việc</h2>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.08, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <FileText className="w-4 h-4" />
                    Tên file
                  </label>
                  <input
                    type="text"
                    value={form.fileName}
                    onChange={(e) => updateField("fileName", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Định dạng
                  </label>
                  <select
                    value={form.format}
                    onChange={(e) => updateField("format", e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none ${
                      errors.format
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    }`}
                  >
                    <option value="EXCEL">Excel (.xlsx)</option>
                    <option value="CSV">CSV</option>
                  </select>
                  {errors.format && (
                    <p className="text-xs text-red-600 mt-1">{errors.format}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <Calendar className="w-4 h-4" />
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={form.fromDate}
                    onChange={(e) => updateField("fromDate", e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none ${
                      errors.fromDate
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    }`}
                  />
                  {errors.fromDate && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.fromDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    <Calendar className="w-4 h-4" />
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={form.toDate}
                    onChange={(e) => updateField("toDate", e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none ${
                      errors.toDate
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                    }`}
                  />
                  {errors.toDate && (
                    <p className="text-xs text-red-600 mt-1">{errors.toDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <Layers className="w-4 h-4" />
                  Bố cục
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["CALENDAR", "ROW", "BOTH"].map((layout) => (
                    <button
                      key={layout}
                      type="button"
                      onClick={() => updateField("layout", layout)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        form.layout === layout
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300"
                      }`}
                    >
                      {layout === "CALENDAR" && "Calendar"}
                      {layout === "ROW" && "Dòng"}
                      {layout === "BOTH" && "Cả hai"}
                    </button>
                  ))}
                </div>
                {errors.layout && (
                  <p className="text-xs text-red-600 mt-1">{errors.layout}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800/60 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.includeShiftSheet}
                    onChange={(e) =>
                      updateField("includeShiftSheet", e.target.checked)
                    }
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    Kèm sheet chi tiết ca
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 bg-gray-50 dark:bg-gray-800/60 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.includeRawDataSheet}
                    onChange={(e) =>
                      updateField("includeRawDataSheet", e.target.checked)
                    }
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    Kèm sheet dữ liệu thô
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  <ListChecks className="w-4 h-4" />
                  Phòng ban
                </label>
                <select
                  value={form.departmentId}
                  onChange={(e) => updateField("departmentId", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none"
                >
                  <option value="">Tất cả</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800/60">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Nhân viên (tùy chọn)
                  </p>
                </div>
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={userKeyword}
                    onChange={(e) => setUserKeyword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none"
                  />
                  {userKeyword && candidateUsers.length > 0 && (
                    <div className="absolute z-20 mt-2 w-full max-h-52 overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                      {candidateUsers.map((u) => (
                        <button
                          type="button"
                          key={u.id}
                          onClick={() => toggleEmployee(u)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {u.fullName}
                          {u.department?.name && (
                            <span className="text-xs text-gray-500 ml-2">
                              {u.department.name}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedEmployees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployees.map((emp) => (
                      <span
                        key={emp.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-sm font-semibold"
                      >
                        {emp.fullName}
                        <button
                          type="button"
                          onClick={() => removeEmployee(emp.id)}
                          className="text-blue-600 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={exporting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg flex items-center gap-2 disabled:opacity-70"
                >
                  {exporting ? (
                    <>
                      <Download className="w-5 h-5 animate-bounce" />
                      <span>Đang xuất ({progress}%)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Xuất file</span>
                    </>
                  )}
                </button>
              </div>

              {exporting && (
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportScheduleModal;
