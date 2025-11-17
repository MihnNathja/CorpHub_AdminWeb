import React, { useState } from "react";

import TodayShiftList from "../components/TodayShiftList";
import CheckInButton from "../components/CheckInButton";
import LiveClock from "../components/LiveClock";
import AttendanceHistory from "../components/AttendanceHistory";
import AttendanceTimeline from "../components/AttendanceTimeline";
import LocationInfo from "../components/LocationInfo";

import { useSchedule } from "../../schedule/hooks/useSchedule";
import { useShiftInfo } from "../hooks/useShiftInfo";
import { useAttendance } from "../hooks/useAttendance";
import { useClientInfo } from "../hooks/useClientInfo";

export default function AttendancePage() {

    // Danh sách ca hôm nay
    const { schedules } = useSchedule();

    const {
        selectedShift,
        setSelectedShift,
        suggestedShift,
        finalShift,
        status,
        timeline
    } = useShiftInfo(schedules);


    // Chấm công
    const { checkInOut } = useAttendance();

    // Lấy GPS + IP
    const { lat, lng, ip } = useClientInfo();

    // Lịch sử demo
    const [attendanceHistory] = useState([
        { date: "2025-11-10", checkIn: "08:05", checkOut: "11:55" },
        { date: "2025-11-11", checkIn: "08:01", checkOut: "12:02" },
        { date: "2025-11-12", checkIn: "08:10", checkOut: null },
    ]);

    const handleDoAttendance = () => {
        if (!finalShift) {
            console.warn("Không có ca hợp lệ để chấm công.");
            return;
        }

        checkInOut(finalShift.id, { lat, lng, ip });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 
                        text-gray-900 dark:text-gray-100 p-6">

            {/* Header */}
            <h1 className="text-2xl font-bold tracking-tight mb-6">Chấm công</h1>

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

                {/* LEFT SIDE */}
                <div className="lg:col-span-5 space-y-6">

                    {/* SECTION 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Clock + Check-in */}
                        <div className="col-span-1 space-y-6">

                            <LiveClock
                                shiftStartTime={finalShift?.shift?.startTime?.substring(0, 5)}
                                shiftEndTime={finalShift?.shift?.endTime?.substring(0, 5)}
                                checkInTime={finalShift?.checkInTime}
                                checkOutTime={finalShift?.checkOutTime}
                                shiftStatus={status}
                                suggestedShift={suggestedShift}
                            />

                            <CheckInButton onClick={handleDoAttendance} />
                        </div>

                        {/* Shift List */}
                        <div className="lg:col-span-2">
                            <TodayShiftList
                                schedules={schedules}
                                selectedShift={selectedShift}
                                suggestedShift={suggestedShift}
                                finalShift={finalShift}
                                onSelect={(ws) => setSelectedShift(ws)}
                            />
                        </div>

                    </div>

                    {/* Location */}
                    <LocationInfo />

                    {/* History
                    <AttendanceHistory history={attendanceHistory} /> */}
                </div>

                {/* RIGHT SIDE — Timeline */}
                <div className="lg:col-span-1 space-y-6">
                    <AttendanceTimeline events={timeline} />
                </div>
            </div>
        </div>
    );
}
