// src/features/ticket/components/TicketFilters.jsx
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const TicketFilters = ({ search, setSearch, status, setStatus }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            {/* Ô tìm kiếm */}
            <div className="relative w-full sm:w-1/3">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm kiếm ticket..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* Bộ lọc trạng thái */}
            <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-xl px-3 py-2 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Tất cả</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
        </div>
    );
};

export default TicketFilters;
