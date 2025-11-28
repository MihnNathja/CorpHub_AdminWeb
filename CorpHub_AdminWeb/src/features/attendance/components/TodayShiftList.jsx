import React from "react";
import ShiftCard from "./ShiftCard";

export default function TodayShiftList({
    schedules = [],
    selectedShift = null,
    suggestedShift = null,
    finalShift = null,
    onSelect
}) {

    return (
        <div
            className="
                bg-white dark:bg-gray-800 
                rounded-xl shadow-sm 
                border border-gray-200 dark:border-gray-700 
                p-5
            "
        >
            <h2 className="text-xl font-bold mb-4 tracking-tight">
                Ca làm hôm nay
            </h2>

            <div className="
                grid 
                grid-cols-[repeat(auto-fit,minmax(220px,1fr))] 
                gap-5
            ">
                {schedules.map((ws, idx) => {
                    const shift = ws.shift;

                    return (
                        <ShiftCard
                            key={ws.id || idx}
                            ws={ws}
                            shift={shift}
                            isSelected={selectedShift?.id === ws.id}
                            isSuggested={suggestedShift?.id === ws.id}
                            isFinal={finalShift?.id === ws.id}
                            onSelect={() => onSelect(ws)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
