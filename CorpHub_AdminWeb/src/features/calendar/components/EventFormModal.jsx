import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RecipientInput from "./RecipientInput";
import UserSuggestions from "./UserSuggestions";
import { useEventForm } from "../hooks/useEventForm";
import StatusButtonGroup from "../../global/components/StatusButtonGroup";
import MeetingRoomRequirementSection from "./MeetingRoomRequirementSection";
import { useAssets } from "../../asset/hooks/useAssets";

export default function EventFormModal({
    isOpen,
    onClose,
    onSubmit,
    slotInfo,
    isOrganizer = true,
}) {
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
        validate,
        suggestions,
        loading,
        status,
        confirmLoading,
        handleSelectStatus,
    } = useEventForm(isOpen, slotInfo);

    const [isEdited, setIsEdited] = useState(true);
    console.log(form);
    useEffect(() => {
        setIsEdited(isOrganizer && !form.ready);
    }, [isOrganizer, form.ready]);

    const { categories } = useAssets();

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isOrganizer) return;
        if (!validate()) return;

        onSubmit({
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
    };

    if (!isOpen || typeof document === "undefined") return null;


    return createPortal(
        <div className="fixed inset-0 z-[10000]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl rounded-xl shadow-2xl bg-white dark:bg-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {slotInfo?.id
                            ? isOrganizer
                                ? "Edit Meeting"
                                : "Meeting Invitation"
                            : "Create Meeting"}
                    </h2>

                    {isOrganizer && slotInfo?.id && (
                        <div>
                            {form.ready ? (
                                <span className="px-3 py-1 text-sm rounded-md bg-green-100 text-green-700">
                                    Confirmed
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleConfirmMeetingReady(form.id)}
                                    className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                >
                                    Confirm Ready
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                    {/* Cột trái */}
                    <div className="space-y-4">
                        {isOrganizer && (
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                    Attendees
                                </label>
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
                                {errors.to && <p className="text-sm text-red-500">{errors.to}</p>}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                Email subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Email subject"
                                value={form.subject}
                                onChange={handleChange}
                                disabled={!isEdited}
                                className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                Event title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Event title"
                                value={form.title}
                                onChange={handleChange}
                                disabled={!isEdited}
                                className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                Description
                            </label>
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                disabled={!isEdited}
                                className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    {/* Cột phải */}
                    <div className="space-y-4">

                        {/* Location */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                Location
                            </label>

                            {isOrganizer ? (
                                <>
                                    {/* Khi là organizer thì mới cho chọn loại */}
                                    <div className="mb-2 flex gap-6" >
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="MEETING_ROOM"
                                                disabled={!isEdited}
                                                checked={form.meetingRoom === true}
                                                onChange={() => {
                                                    handleChange({ target: { name: "meetingRoom", value: true } });
                                                    handleChange({ target: { name: "location", value: "Chờ sắp xếp" } });
                                                }}
                                            />
                                            Meeting room
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="OUTSIDE"
                                                disabled={!isEdited}
                                                checked={form.meetingRoom === false}
                                                onChange={() => {
                                                    handleChange({ target: { name: "meetingRoom", value: false } });
                                                    handleChange({ target: { name: "location", value: "" } });
                                                }}
                                            />
                                            Outside
                                        </label>
                                    </div>

                                    {/* Input location */}
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder={form.meetingRoom ? "Sẽ được sắp xếp sau" : "Nhập địa chỉ"}
                                        value={form.location}
                                        onChange={handleChange}
                                        disabled={form.meetingRoom && isOrganizer}
                                        className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />

                                    {/* Nếu chọn meeting room thì hiện thêm section */}
                                    {form.meetingRoom && isOrganizer && (
                                        <MeetingRoomRequirementSection
                                            assetCates={categories}
                                            selectedAssetCates={form.roomRequirement.assetCategories}
                                            onToggle={handleToggleAsset}
                                            disabled={!isEdited}
                                            capacity={form.roomRequirement.capacity}
                                            onCapacityChange={handleCapacityChange}
                                            bookingTime={{
                                                start: form.roomRequirement.start,
                                                end: form.roomRequirement.end,
                                            }}
                                            onBookingTimeChange={handleBookingTimeChange}
                                        />

                                    )}
                                </>
                            ) : (
                                // Nếu không phải organizer thì chỉ hiển thị location như text field
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    disabled
                                    className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                       bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                />
                            )}
                        </div>


                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                Online meeting link
                            </label>
                            <input
                                type="text"
                                name="onlineLink"
                                placeholder="Online meeting link"
                                value={form.onlineLink}
                                onChange={handleChange}
                                disabled={!isEdited}
                                className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                    Start
                                </label>
                                <input
                                    type="datetime-local"
                                    name="start"
                                    value={form.start}
                                    onChange={handleChange}
                                    disabled={!isEdited}
                                    className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                {errors.start && (
                                    <p className="text-sm text-red-500">{errors.start}</p>
                                )}
                            </div>

                            <div className="flex-1 space-y-1">
                                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                                    End
                                </label>
                                <input
                                    type="datetime-local"
                                    name="end"
                                    value={form.end}
                                    onChange={handleChange}
                                    disabled={!isEdited}
                                    className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 
                                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                {errors.end && (
                                    <p className="text-sm text-red-500">{errors.end}</p>
                                )}
                            </div>
                        </div>

                        {errors.range && <p className="text-sm text-red-500">{errors.range}</p>}

                        <div className="flex justify-end items-center gap-4">
                            {isOrganizer ? (
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            ) : (
                                <StatusButtonGroup
                                    value={status}
                                    onChange={handleSelectStatus}
                                    loading={confirmLoading}
                                />
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
