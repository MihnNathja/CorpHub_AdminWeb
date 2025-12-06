import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { X, Edit3, Trash2, MapPin, Link as LinkIcon, Clock, AlertCircle, GripHorizontal } from "lucide-react";
import ConfirmDialog from "../../global/components/ConfirmDialog";

const EventPopup = ({ event, position, onClose, onEdit, onDelete }) => {
    const popupRef = useRef(null);
    const headerRef = useRef(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState(position);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Handle drag start
    const handleMouseDown = (e) => {
        // Only drag from header area
        if (!headerRef.current || !headerRef.current.contains(e.target)) return;
        if (e.target.closest("button")) return; // Don't drag if clicking button

        setIsDragging(true);
        const rect = popupRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    // Handle drag move
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep popup within viewport bounds
        const maxX = window.innerWidth - 400;
        const maxY = window.innerHeight - 200;

        setPopupPosition({
            x: Math.max(16, Math.min(newX, maxX)),
            y: Math.max(16, Math.min(newY, maxY)),
        });
    };

    // Handle drag end
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Auto close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    // Add drag listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "grabbing";

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.body.style.cursor = "auto";
            };
        }
    }, [isDragging, dragOffset]);

    if (!event || !popupPosition) return null;

    // Determine status color
    const getStatusColor = () => {
        switch (event.status?.toUpperCase()) {
            case "ORGANIZER":
                return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
            case "ACCEPTED":
                return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
            case "DECLINED":
                return "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
            case "PENDING":
            default:
                return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
        }
    };

    const getStatusLabel = () => {
        switch (event.status?.toUpperCase()) {
            case "ORGANIZER":
                return "Organizer";
            case "ACCEPTED":
                return "Accepted";
            case "DECLINED":
                return "Declined";
            case "PENDING":
            default:
                return "Pending";
        }
    };

    return (
        <>
            <div
                ref={popupRef}
                className={`fixed z-50 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden w-96 max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col transition-shadow duration-200 ${isDragging ? "shadow-2xl ring-2 ring-blue-400" : ""
                    }`}
                style={{
                    top: `${popupPosition.y}px`,
                    left: `${popupPosition.x}px`,
                }}
            >
                {/* Header - Draggable */}
                <div
                    ref={headerRef}
                    onMouseDown={handleMouseDown}
                    className={`p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between gap-3 ${isDragging ? "cursor-grabbing" : "cursor-grab"
                        } select-none`}
                >
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="mt-1 text-gray-400 dark:text-gray-600 flex-shrink-0 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                            <GripHorizontal className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                    {event.title}
                                </h3>
                                {event.status && (
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${getStatusColor()}`}>
                                        {getStatusLabel()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400 flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Description */}
                    {event.description && (
                        <div className="space-y-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                {event.description}
                            </p>
                        </div>
                    )}

                    {/* Date & Time */}
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Date & Time
                            </p>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {format(new Date(event.start), "EEE, MMM d, yyyy")}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {format(new Date(event.start), "HH:mm")} – {format(new Date(event.end), "HH:mm")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                                    Location
                                </p>
                                <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
                                    {event.location}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Online Link */}
                    {event.onlineLink && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                            <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Meeting Link
                                </p>
                                <a
                                    href={event.onlineLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                                >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    Join Meeting
                                </a>
                            </div>
                        </div>
                    )}

                    {/* No Description */}
                    {!event.description && !event.location && !event.onlineLink && (
                        <div className="text-center py-6">
                            <AlertCircle className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                No additional details
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer - Actions */}
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
                    <button
                        onClick={() => {
                            onEdit(event);
                            setTimeout(onClose, 50);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                        Edit
                    </button>

                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm font-semibold transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Close
                    </button>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={isConfirmOpen}
                title="Delete this event?"
                message="Are you sure you want to delete this meeting? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                confirmColor="danger"
                onConfirm={() => {
                    onDelete?.(event.id);
                    setIsConfirmOpen(false);
                    onClose();
                }}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
};

export default EventPopup;
