import { useState, useMemo } from "react";
import {
  UserRound,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Paperclip,
  Filter,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section from "../Section";

// ===== ICON THEO LOẠI =====
const typeConfig = {
  JOIN: { icon: UserRound, color: "bg-blue-500" },
  PROMOTION: { icon: ShieldCheck, color: "bg-green-500" },
  AWARD: { icon: Star, color: "bg-yellow-500" },
  TRANSFER: { icon: MapPin, color: "bg-purple-500" },
  PROJECT: { icon: Briefcase, color: "bg-indigo-500" },
  CERTIFICATE: { icon: Award, color: "bg-orange-500" },
  DEFAULT: { icon: Clock, color: "bg-gray-400" },
};

const getConfig = (type) => typeConfig[type] || typeConfig.DEFAULT;

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

// ===== MOCK DỮ LIỆU =====
const items = [
  {
    type: "JOIN",
    title: "Gia nhập công ty",
    date: "2020-06-01",
    description: "Bắt đầu làm việc tại Phòng Kỹ thuật - Dự án nội bộ HRM.",
    confirmedBy: "Trần Thị B (Trưởng phòng)",
  },
  {
    type: "PROMOTION",
    title: "Thăng chức Kỹ sư chính",
    date: "2022-09-15",
    description:
      "Được bổ nhiệm chức danh Kỹ sư chính, phụ trách nhóm frontend.",
    related: "Quyết định số 12/QĐ-2022",
    confirmedBy: "Phòng Nhân sự",
    fileUrl: "/docs/quyetdinh12.pdf",
  },
  {
    type: "AWARD",
    title: "Nhân viên xuất sắc quý I/2023",
    date: "2023-03-30",
    description: "Đạt thành tích cao trong dự án triển khai ERP.",
  },
  {
    type: "TRANSFER",
    title: "Điều chuyển sang Phòng Giải pháp doanh nghiệp",
    date: "2024-02-01",
    description: "Phụ trách giải pháp kỹ thuật cho khách hàng doanh nghiệp.",
    related: "QĐ số 03/QĐ-2024",
  },
  {
    type: "PROJECT",
    title: "Tham gia dự án nâng cấp hệ thống nhân sự",
    date: "2025-04-01",
    description: "Vai trò: Technical Lead. Dự án hoàn thành tháng 8/2025.",
    confirmedBy: "Ban Giám đốc",
  },
];

// ===== COMPONENT CHÍNH =====
const TimelineSection = () => {
  const [yearFilter, setYearFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const yearOptions = useMemo(() => {
    const years = items.map((i) =>
      i.date ? new Date(i.date).getFullYear() : null
    );
    return Array.from(new Set(years.filter(Boolean))).sort((a, b) => b - a);
  }, []);

  const typeOptions = [
    { value: "", label: "Tất cả" },
    { value: "JOIN", label: "Gia nhập" },
    { value: "PROMOTION", label: "Thăng chức" },
    { value: "AWARD", label: "Khen thưởng" },
    { value: "TRANSFER", label: "Điều chuyển" },
    { value: "PROJECT", label: "Dự án" },
    { value: "CERTIFICATE", label: "Chứng chỉ" },
  ];

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const y = i.date ? new Date(i.date).getFullYear().toString() : "";
      const matchesYear = !yearFilter || y === yearFilter;
      const matchesType = !typeFilter || i.type === typeFilter;
      return matchesYear && matchesType;
    });
  }, [yearFilter, typeFilter]);

  // Nhóm theo năm
  const grouped = useMemo(() => {
    const result = {};
    filtered.forEach((i) => {
      const y = i.date ? new Date(i.date).getFullYear() : "Khác";
      if (!result[y]) result[y] = [];
      result[y].push(i);
    });
    return result;
  }, [filtered]);

  // Hiệu ứng cuộn sáng dần
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section
      title="Dòng thời gian công việc"
      right={
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border rounded-xl px-2 py-1 text-sm text-gray-700"
          >
            <option value="">Tất cả năm</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-xl px-2 py-1 text-sm text-gray-700"
          >
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 italic mt-2">
          Không có sự kiện nào phù hợp với bộ lọc
        </p>
      ) : (
        <div className="relative mt-5 ml-5 border-l-2 border-gray-200">
          {/* Đường timeline phát sáng */}
          <motion.div
            style={{ scaleY: pathLength }}
            className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-blue-400 to-blue-600 origin-top"
          />

          {Object.entries(grouped)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([year, events]) => (
              <div key={year}>
                <h3 className="text-base font-semibold text-gray-800 mb-3 ml-3 mt-4">
                  {year}
                </h3>
                {events.map((event, idx) => {
                  const { icon: Icon, color } = getConfig(event.type);
                  return (
                    <motion.div
                      key={idx}
                      className="relative pl-6 pb-8 group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      {/* Dot timeline */}
                      <div
                        className={`absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-white shadow ${color} group-hover:scale-125 transition-transform`}
                      />

                      {/* Nội dung */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-gray-700" />
                          <h4 className="font-medium text-gray-800 text-sm">
                            {event.title}
                          </h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(event.date)}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {event.related && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Liên quan: {event.related}
                        </p>
                      )}

                      {event.fileUrl && (
                        <a
                          href={event.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <Paperclip size={12} /> Tệp đính kèm
                        </a>
                      )}

                      {event.confirmedBy && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Xác nhận bởi: {event.confirmedBy}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
        </div>
      )}
    </Section>
  );
};

export default TimelineSection;
