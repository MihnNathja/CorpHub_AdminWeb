import React from "react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

const JobHistorySection = ({
  jobHistories,
  handleJobChange,
  addJobHistory,
  removeJobHistory,
}) => {
  return (
    <section className="p-6 border rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Lịch sử công việc
        </h3>
        <button
          type="button"
          onClick={addJobHistory}
          className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
        >
          <PlusCircleIcon className="h-5 w-5" /> Thêm
        </button>
      </div>

      <div className="space-y-4">
        {jobHistories.map((job, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 relative"
          >
            <input
              type="text"
              placeholder="Vị trí"
              value={job.position}
              onChange={(e) =>
                handleJobChange(index, "position", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Loại hợp đồng"
              value={job.contractType}
              onChange={(e) =>
                handleJobChange(index, "contractType", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={job.startDate}
              onChange={(e) =>
                handleJobChange(index, "startDate", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <input
              type="date"
              value={job.endDate}
              onChange={(e) =>
                handleJobChange(index, "endDate", e.target.value)
              }
              className="border rounded-lg p-2"
            />
            <button
              type="button"
              onClick={() => removeJobHistory(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default JobHistorySection;
