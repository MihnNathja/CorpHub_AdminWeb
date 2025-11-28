import { useEffect, useMemo, useState } from "react";

// Helpers
const hm = (t) => t?.substring(0, 5) || "--:--";
const toMinutes = (t) => {
    if (!t || t === "--:--") return Infinity;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};
const extractHM = (iso) => (iso ? iso.match(/\d{2}:\d{2}/)?.[0] : null);

/**
 * useShiftInfo (phiên bản mới)
 * Hook TỰ QUẢN selectedShift
 */
export const useShiftInfo = (schedules = []) => {

    /* 0) selectedShift do user chọn */
    const [selectedShift, setSelectedShift] = useState(null);

    /* 1) Đồng hồ giờ */
    const [nowHM, setNowHM] = useState(
        new Date().toTimeString().substring(0, 5)
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setNowHM(new Date().toTimeString().substring(0, 5));
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    /* 2) suggestedShift (tự động đoán ca) */
    let suggestedShift = null;
    let status = "none";

    if (schedules.length > 0) {

        const sorted = [...schedules].sort((a, b) =>
            hm(a.shift.startTime).localeCompare(hm(b.shift.startTime))
        );

        const isInShift = (ws) => {
            const start = hm(ws.shift.startTime);
            const end = hm(ws.shift.endTime);
            return nowHM >= start && nowHM <= end;
        };

        const current = sorted.find(isInShift);

        if (current) {
            suggestedShift = current;
            status = "in_progress";
        } else {
            const next = sorted.find(ws => nowHM < hm(ws.shift.startTime));
            if (next) {
                suggestedShift = next;
                status = "upcoming";
            } else {
                suggestedShift = sorted[sorted.length - 1];
                status = "finished";
            }
        }
    }

    /* 3) finalShift (ưu tiên selectedShift) */
    const finalShift = selectedShift || suggestedShift;

    /* 4) Đồng hồ timeline */
    const [now, setNow] = useState(nowHM);

    useEffect(() => {
        const timer = setInterval(() => {
            const t = new Date().toTimeString().substring(0, 5);
            setNow(t);
        }, 15000);
        return () => clearInterval(timer);
    }, []);

    /* 5) Tính timeline */
    const timeline = useMemo(() => {
        if (!schedules || schedules.length === 0) return [];

        let events = [];

        schedules.forEach(ws => {
            const shift = ws.shift;

            const start = hm(shift.startTime);
            const end = hm(shift.endTime);
            const checkIn = extractHM(ws.checkInTime);
            const checkOut = extractHM(ws.checkOutTime);

            events.push({ label: `Giờ vào (${shift.name})`, time: start, type: "shift_start" });
            events.push({ label: `Check-in (${shift.name})`, time: checkIn || "--:--", type: "checkin" });
            events.push({ label: `Check-out (${shift.name})`, time: checkOut || "--:--", type: "checkout" });
            events.push({ label: `Giờ ra (${shift.name})`, time: end, type: "shift_end" });
        });

        return events.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
    }, [schedules, now]);

    /* 6) Expose API cho UI */
    return {
        selectedShift,
        setSelectedShift, // ⭐ trả ra hàm setState để UI dùng
        suggestedShift,
        finalShift,
        status,
        now,
        nowHM,
        timeline,
    };
};
