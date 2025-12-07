import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Clock, MapPin, AlertCircle, CheckCircle2, Zap } from "lucide-react";

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
    const { schedules } = useSchedule();

    const {
        selectedShift,
        setSelectedShift,
        suggestedShift,
        finalShift,
        status,
        timeline
    } = useShiftInfo(schedules);

    const { checkInOut } = useAttendance();
    const { lat, lng, ip } = useClientInfo();

    const [attendanceHistory] = useState([
        { date: "2025-11-10", checkIn: "08:05", checkOut: "11:55" },
        { date: "2025-11-11", checkIn: "08:01", checkOut: "12:02" },
        { date: "2025-11-12", checkIn: "08:10", checkOut: null },
    ]);

    // ✅ Kiểm tra xem ca làm đã hết hay chưa
    const isShiftExpired = useMemo(() => {
        if (!finalShift?.shift?.endTime) return false;

        const now = dayjs();
        const shiftEndTime = dayjs(
            `${now.format("YYYY-MM-DD")} ${finalShift.shift.endTime}`,
            "YYYY-MM-DD HH:mm"
        );

        return now.isAfter(shiftEndTime);
    }, [finalShift]);

    // ✅ Kiểm tra xem đã check-in hay chưa
    const isAlreadyCheckedIn = finalShift?.checkInTime;

    // ✅ Disable button nếu: đã hết ca và chưa check-in
    const isCheckInDisabled = isShiftExpired && !isAlreadyCheckedIn;

    const handleDoAttendance = () => {
        if (!finalShift) {
            console.warn("Không có ca hợp lệ để chấm công.");
            return;
        }

        // ✅ Kiểm tra trước khi chấm công
        if (isCheckInDisabled) {
            console.warn("Ca làm đã hết, không thể chấm công.");
            return;
        }

        checkInOut(finalShift.id, { lat, lng, ip });
    };

    return (
        <div className="space-y-6">
            {/* Header Card - Matching other pages */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 rounded-xl bg-white/15 backdrop-blur-sm">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-white/80 uppercase tracking-wide">Employee Portal</p>
                        <h1 className="text-3xl font-bold">Attendance Check-In</h1>
                    </div>
                </div>
                <p className="text-sm text-white/70 ml-16">
                    Track your work hours and manage your attendance
                </p>
            </div>

            {/* Alert Banners */}
            {isCheckInDisabled && (
                <div className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100">
                            Shift Time Expired
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                            Your shift has ended. Check-in is no longer available.
                        </p>
                    </div>
                </div>
            )}

            {isAlreadyCheckedIn && !isShiftExpired && (
                <div className="p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                            Checked In Successfully
                        </p>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200 mt-1">
                            You checked in at {dayjs(finalShift.checkInTime).format("HH:mm")}
                        </p>
                    </div>
                </div>
            )}

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">

                {/* LEFT SIDE */}
                <div className="lg:col-span-5 space-y-6">

                    {/* SECTION 1: Clock + Shifts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Clock + Check-in */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Live Clock Card */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
                                    <LiveClock
                                        shiftStartTime={finalShift?.shift?.startTime?.substring(0, 5)}
                                        shiftEndTime={finalShift?.shift?.endTime?.substring(0, 5)}
                                        checkInTime={finalShift?.checkInTime}
                                        checkOutTime={finalShift?.checkOutTime}
                                        shiftStatus={status}
                                        suggestedShift={suggestedShift}
                                    />
                                </div>
                            </div>

                            {/* Check-in Button */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                <CheckInButton
                                    onClick={handleDoAttendance}
                                    disabled={isCheckInDisabled}
                                    title={isCheckInDisabled ? "Shift time expired" : "Check In / Out"}
                                />
                            </div>
                        </div>

                        {/* Shift List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        Today's Shifts
                                    </h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Select your working shift
                                    </p>
                                </div>
                                <div className="p-6">
                                    <TodayShiftList
                                        schedules={schedules}
                                        selectedShift={selectedShift}
                                        suggestedShift={suggestedShift}
                                        finalShift={finalShift}
                                        onSelect={(ws) => setSelectedShift(ws)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Location Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                Location Information
                            </h2>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                Your check-in location details
                            </p>
                        </div>
                        <div className="p-6">
                            <LocationInfo lat={lat} lng={lng} ip={ip} />
                        </div>
                    </div>

                    {/* Attendance History - Optional */}
                    {/* <AttendanceHistory history={attendanceHistory} /> */}
                </div>

                {/* RIGHT SIDE — Timeline */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden sticky top-6 max-h-[calc(100vh-120px)]">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                Timeline
                            </h3>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                            <AttendanceTimeline events={timeline} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
