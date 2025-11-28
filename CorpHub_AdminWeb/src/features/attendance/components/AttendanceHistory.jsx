export default function AttendanceHistory({ history }) {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-3">Lịch sử chấm công</h2>

            <ul className="space-y-3">
                {history.map((h, idx) => (
                    <li key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                        <p className="font-semibold">{h.date}</p>
                        <p>Check-in: {h.checkIn || "--"}</p>
                        <p>Check-out: {h.checkOut || "--"}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
