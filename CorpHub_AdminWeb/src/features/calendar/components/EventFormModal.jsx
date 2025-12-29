import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RecipientInput from "./RecipientInput";
import UserSuggestions from "./UserSuggestions";
import { useEventForm } from "../hooks/useEventForm";
import StatusButtonGroup from "../../global/components/StatusButtonGroup";
import MeetingRoomRequirementSection from "./MeetingRoomRequirementSection";
import { useAssetsCategory } from "../../asset/hooks/useAssetsCategory";
import { useAuth } from "../../auth/hooks/useAuth";
import { X, Calendar, MapPin, Link as LinkIcon, Users, Clock, CheckCircle2 } from "lucide-react";

export default function EventFormModal({
    isOpen,
    onClose,
    onSubmit,
    slotInfo,
    isOrganizer = true,
}) {
    const { hasRole } = useAuth();
    const isUserRole = hasRole('ROLE_USER');
    
    const {
        form,
        setForm,
        handleChange,
        recipients,
        setRecipients,
        handleAddRecipient,
        handleRemoveRecipient,
        handleConfirmMeetingReady,
        query,
        setQuery,
        errors,
        setErrors,
        suggestions,
        loading,
        status,
        confirmLoading,
        handleSelectStatus,
    } = useEventForm(isOpen, slotInfo);

    const [isEdited, setIsEdited] = useState(true);
    const [isLocationEdited, setIsLocationEdited] = useState(true);

    useEffect(() => {
        setIsEdited(isOrganizer && !form.ready && !isUserRole);
    }, [isOrganizer, form.ready, isUserRole]);

    useEffect(() => {
        setIsLocationEdited(isEdited && (!form.meetingRoom || !form.roomRequirement?.roomId));
    }, [isEdited, form.meetingRoom, form.roomRequirement?.roomId]);

    const { categories } = useAssetsCategory();

    const handleToggleAsset = (asset) => {
        setForm((prev) => {
            const already = prev.roomRequirement.assetCategories.includes(asset.id);
            return {
                ...prev,
                roomRequirement: {
                    ...prev.roomRequirement,
                    assetCategories: already
                        ? prev.roomRequirement.assetCategories.filter((id) => id !== asset.id)
                        : [...prev.roomRequirement.assetCategories, asset.id],
                },
            };
        });
    };

    const handleCapacityChange = (value) => {
        setForm((prev) => ({
            ...prev,
            roomRequirement: { ...prev.roomRequirement, capacity: value },
        }));
    };

    const handleBookingTimeChange = (time) => {
        setForm((prev) => ({
            ...prev,
            roomRequirement: { ...prev.roomRequirement, ...time },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOrganizer) return;

        const result = await onSubmit({
            ...form,
            to: recipients.map((r) => r.email),
            start: new Date(form.start),
            end: new Date(form.end),
            roomRequirement: form.meetingRoom
                ? {
                    ...form.roomRequirement,
                    start: form.roomRequirement.start ? new Date(form.roomRequirement.start) : null,
                    end: form.roomRequirement.end ? new Date(form.roomRequirement.end) : null,
                }
                : null,
        });

        if (result.validationErrors) {
            setErrors(result.validationErrors);
        }
    };

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-800 px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-600 text-white">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {slotInfo?.id
                                        ? isOrganizer
                                            ? "Edit Meeting"
                                            : "Meeting Invitation"
                                        : "Create Meeting"}
                                </h2>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                    {isOrganizer ? "Manage event details" : "View meeting details"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isOrganizer && slotInfo?.id && (
                                <div>
                                    {form.ready ? (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Confirmed</span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleConfirmMeetingReady(form.id)}
                                            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                                        >
                                            Confirm Ready
                                        </button>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="space-y-6">
                            {/* Attendees Section */}
                            {isOrganizer && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        Attendees
                                    </label>
                                    <div className="space-y-2">
                                        <RecipientInput
                                            recipients={recipients}
                                            onRemove={handleRemoveRecipient}
                                            onAddRecipient={handleAddRecipient}
                                            inputValue={query}
                                            disabled={!isEdited}
                                            onInputChange={setQuery}
                                            onBackspaceRemove={() =>
                                                setRecipients((prev) => prev.slice(0, -1))
                                            }
                                        />
                                        <UserSuggestions
                                            suggestions={suggestions}
                                            onSelect={handleAddRecipient}
                                        />
                                    </div>
                                    {errors.to && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span className="inline-block">⚠</span> {errors.to}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Subject Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                    Email Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Enter email subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    disabled={!isEdited}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                {errors.subject && (
                                    <p className="text-sm text-red-500">⚠ {errors.subject}</p>
                                )}
                            </div>

                            {/* Title Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter event title"
                                    value={form.title}
                                    onChange={handleChange}
                                    disabled={!isEdited}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500">⚠ {errors.title}</p>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Enter event description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={5}
                                    disabled={!isEdited}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500">⚠ {errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="space-y-6">
                            {/* Date & Time Section */}
                            <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Date & Time
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="start"
                                            value={form.start}
                                            onChange={handleChange}
                                            disabled={!isEdited}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                        {errors.start && (
                                            <p className="text-xs text-red-500 mt-1">⚠ {errors.start}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                            End Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="end"
                                            value={form.end}
                                            onChange={handleChange}
                                            disabled={!isEdited}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                        {errors.end && (
                                            <p className="text-xs text-red-500 mt-1">⚠ {errors.end}</p>
                                        )}
                                    </div>
                                    {errors.range && (
                                        <p className="text-sm text-red-500">⚠ {errors.range}</p>
                                    )}
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Location
                                    </h3>
                                </div>

                                {isOrganizer ? (
                                    <div className="space-y-3">
                                        {/* Location Type Selection */}
                                        <div className="flex gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="MEETING_ROOM"
                                                    disabled={!isLocationEdited}
                                                    checked={form.meetingRoom === true}
                                                    onChange={() => {
                                                        handleChange({ target: { name: "meetingRoom", value: true } });
                                                        handleChange({ target: { name: "location", value: "Chờ sắp xếp" } });
                                                    }}
                                                    className="w-4 h-4 accent-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Meeting Room
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value="OUTSIDE"
                                                    disabled={!isLocationEdited}
                                                    checked={form.meetingRoom === false}
                                                    onChange={() => {
                                                        handleChange({ target: { name: "meetingRoom", value: false } });
                                                        handleChange({ target: { name: "location", value: "" } });
                                                    }}
                                                    className="w-4 h-4 accent-blue-600"
                                                />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Outside
                                                </span>
                                            </label>
                                        </div>

                                        {/* Location Input */}
                                        <input
                                            type="text"
                                            name="location"
                                            placeholder={form.meetingRoom ? "Will be arranged" : "Enter address"}
                                            value={form.location}
                                            onChange={handleChange}
                                            disabled={form.meetingRoom || !isEdited}
                                            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />

                                        {/* Meeting Room Requirements */}
                                        {form.meetingRoom && isOrganizer && (
                                            <MeetingRoomRequirementSection
                                                assetCates={categories}
                                                errors={errors}
                                                selectedAssetCates={form.roomRequirement.assetCategories}
                                                onToggle={handleToggleAsset}
                                                disabled={!isLocationEdited}
                                                capacity={form.roomRequirement.capacity}
                                                onCapacityChange={handleCapacityChange}
                                                bookingTime={{
                                                    start: form.roomRequirement.start,
                                                    end: form.roomRequirement.end,
                                                }}
                                                onBookingTimeChange={handleBookingTimeChange}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        disabled
                                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                )}
                            </div>

                            {/* Online Link Section */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    <LinkIcon className="w-4 h-4 text-blue-600" />
                                    Online Meeting Link
                                </label>
                                <input
                                    type="text"
                                    name="onlineLink"
                                    placeholder="https://meet.example.com/..."
                                    value={form.onlineLink}
                                    onChange={handleChange}
                                    disabled={!isEdited}
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                />
                                {errors.onlineLink && (
                                    <p className="text-sm text-red-500">⚠ {errors.onlineLink}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer - Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium transition-colors"
                        >
                            Close
                        </button>

                        {isOrganizer ? (
                            <button
                                type="submit"
                                disabled={!isEdited || loading || isUserRole}
                                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        Save Meeting
                                    </>
                                )}
                            </button>
                        ) : (
                            <StatusButtonGroup
                                value={status}
                                onChange={handleSelectStatus}
                                loading={confirmLoading}
                            />
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
