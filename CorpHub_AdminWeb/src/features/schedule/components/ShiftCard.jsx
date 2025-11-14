import dayjs from "dayjs";
import "dayjs/locale/vi";

const STATUS_STYLE = {
    SCHEDULED: {
        bg: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
    },
    IN_PROGRESS: {
        bg: "bg-purple-100",
        border: "border-purple-400",
        text: "text-purple-700",
    },
    COMPLETED: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
    },
    MISSED: {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
    },
    CANCELLED: {
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-500",
    },
    ABSENCE: {
        bg: "bg-amber-50",
        border: "border-amber-300",
        text: "text-amber-700",
    },
};

const ShiftCard = ({ shift }) => {
    const style = STATUS_STYLE[shift.status] || STATUS_STYLE.SCHEDULED;

    const checkIn = shift.checkInTime ? dayjs(shift.checkInTime) : null;
    const checkOut = shift.checkOutTime ? dayjs(shift.checkOutTime) : null;

    const plannedStart = dayjs(shift.start);
    const plannedEnd = dayjs(shift.end);

    const isLate = checkIn && checkIn.isAfter(plannedStart);
    const isEarly = checkOut && checkOut.isBefore(plannedEnd);

    return (
        <div
            className={`relative w-full border ${style.border} ${style.bg} ${style.text} rounded-lg px-2 py-1 text-[11px]`}
        >
            {/* Shift title */}
            <div className="font-semibold truncate">{shift.title}</div>

            {/* Planned time */}
            <div className="text-[10px]">
                {plannedStart.format("HH:mm")} – {plannedEnd.format("HH:mm")}
            </div>

            {/* Check-in/out display */}
            {(checkIn || checkOut) && (
                <div className="mt-1 text-[10px] space-y-0.5">
                    {checkIn && (
                        <div className={isLate ? "text-red-600 font-semibold" : ""}>
                            Check-in: {checkIn.format("HH:mm")}
                            {isLate && <span className="ml-1">⚠️</span>}
                        </div>
                    )}

                    {checkOut && (
                        <div className={isEarly ? "text-red-600 font-semibold" : ""}>
                            Check-out: {checkOut.format("HH:mm")}
                            {isEarly && <span className="ml-1">⚠️</span>}
                        </div>
                    )}
                </div>
            )}

            {/* Notes */}
            {shift.notes && <div className="mt-1 italic">{shift.notes}</div>}
        </div>
    );
};

export default ShiftCard;
