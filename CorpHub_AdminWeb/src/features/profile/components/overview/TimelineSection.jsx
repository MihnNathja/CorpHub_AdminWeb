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

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-US") : "-");

// ===== MOCK DỮ LIỆU =====
const items = [
  {
    type: "JOIN",
    title: "Joined the company",
    date: "2020-06-01",
    description:
      "Started working in the Engineering Department on the internal HRM project.",
    confirmedBy: "Ms. B, Department Head",
  },
  {
    type: "PROMOTION",
    title: "Promoted to Senior Engineer",
    date: "2022-09-15",
    description: "Appointed as Senior Engineer, leading the frontend group.",
    related: "Decision No. 12/QD-2022",
    confirmedBy: "Human Resources Department",
    fileUrl: "/docs/quyetdinh12.pdf",
  },
  {
    type: "AWARD",
    title: "Outstanding employee Q1 2023",
    date: "2023-03-30",
    description: "Achieved top performance in the ERP rollout project.",
  },
  {
    type: "TRANSFER",
    title: "Transferred to Enterprise Solutions Department",
    date: "2024-02-01",
    description:
      "Responsible for technical solutions for enterprise customers.",
    related: "Decision No. 03/QD-2024",
  },
  {
    type: "PROJECT",
    title: "Joined HR system upgrade project",
    date: "2025-04-01",
    description: "Role: Technical Lead. Project completed August 2025.",
    confirmedBy: "Board of Directors",
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
    { value: "", label: "All" },
    { value: "JOIN", label: "Join" },
    { value: "PROMOTION", label: "Promotion" },
    { value: "AWARD", label: "Award" },
    { value: "TRANSFER", label: "Transfer" },
    { value: "PROJECT", label: "Project" },
    { value: "CERTIFICATE", label: "Certificate" },
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
      const y = i.date ? new Date(i.date).getFullYear() : "Other";
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
      title="Work timeline"
      right={
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border rounded-xl px-2 py-1 text-sm text-gray-700"
          >
            <option value="">All years</option>
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
          No events match the filter
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
                          Related: {event.related}
                        </p>
                      )}

                      {event.fileUrl && (
                        <a
                          href={event.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <Paperclip size={12} /> Attachment
                        </a>
                      )}

                      {event.confirmedBy && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          Verified by: {event.confirmedBy}
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
