import React from "react";
import { createPortal } from "react-dom";
import RecipientInput from "./RecipientInput";
import UserSuggestions from "./UserSuggestions";
import { useEventForm } from "../hooks/useEventForm";
import StatusButtonGroup from "../../global/components/StatusButtonGroup";

export default function EventFormModal({
    isOpen,
    onClose,
    onSubmit,
    slotInfo,
    isOrganizer = true,
}) {
    const {
        form,
        handleChange,
        recipients,
        handleAddRecipient,
        handleRemoveRecipient,
        query,
        setQuery,
        errors,
        validate,
        suggestions,
        loading,
        status,
        confirmLoading,
        handleSelectStatus, // đã gom logic API confirmAttend vào hook
    } = useEventForm(isOpen, slotInfo);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isOrganizer) return;

        if (!validate()) return;
        onSubmit({
            ...form,
            to: recipients.map((r) => r.email),
            start: new Date(form.start),
            end: new Date(form.end),
        });
    };

    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000]">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-xl shadow-2xl bg-white dark:bg-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {slotInfo?.id
                        ? isOrganizer
                            ? "Edit Meeting"
                            : "Meeting Invitation"
                        : "Create Meeting"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Recipient Input (ẩn khi attendee vì chỉ xem) */}
                    {isOrganizer && (
                        <>
                            <RecipientInput
                                recipients={recipients}
                                onRemove={handleRemoveRecipient}
                                onAddRecipient={handleAddRecipient}
                                inputValue={query}
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
                        </>
                    )}

                    {/* Inputs - disable khi attendee */}
                    <input
                        type="text"
                        name="subject"
                        placeholder="Email subject"
                        value={form.subject}
                        onChange={handleChange}
                        disabled={!isOrganizer}
                        className={`w-full rounded-md p-2 border ${!isOrganizer
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white dark:bg-gray-700"
                            } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                    />

                    <input
                        type="text"
                        name="title"
                        placeholder="Event title"
                        value={form.title}
                        onChange={handleChange}
                        disabled={!isOrganizer}
                        className={`w-full rounded-md p-2 border ${!isOrganizer
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white dark:bg-gray-700"
                            } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        disabled={!isOrganizer}
                        className={`w-full rounded-md p-2 border ${!isOrganizer
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white dark:bg-gray-700"
                            } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        disabled={!isOrganizer}
                        className={`w-full rounded-md p-2 border ${!isOrganizer
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white dark:bg-gray-700"
                            } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                    />

                    <input
                        type="text"
                        name="onlineLink"
                        placeholder="Online meeting link"
                        value={form.onlineLink}
                        onChange={handleChange}
                        disabled={!isOrganizer}
                        className={`w-full rounded-md p-2 border ${!isOrganizer
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white dark:bg-gray-700"
                            } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                    />

                    {/* Start / End */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Start</label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={form.start}
                                onChange={handleChange}
                                disabled={!isOrganizer}
                                className={`w-full rounded-md p-2 border ${!isOrganizer
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white dark:bg-gray-700"
                                    } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                            />
                            {errors.start && (
                                <p className="text-sm text-red-500">{errors.start}</p>
                            )}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">End</label>
                            <input
                                type="datetime-local"
                                name="end"
                                value={form.end}
                                onChange={handleChange}
                                disabled={!isOrganizer}
                                className={`w-full rounded-md p-2 border ${!isOrganizer
                                    ? "bg-gray-100 cursor-not-allowed"
                                    : "bg-white dark:bg-gray-700"
                                    } border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100`}
                            />
                            {errors.end && (
                                <p className="text-sm text-red-500">{errors.end}</p>
                            )}
                        </div>
                    </div>

                    {errors.range && <p className="text-sm text-red-500">{errors.range}</p>}

                    {/* Footer buttons */}

                    <div className="flex justify-end items-center gap-4">
                        {isOrganizer ?
                            (<button type="submit"
                                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white" >
                                {loading ? "Saving..." : "Save"}
                            </button>)

                            : (
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
                </form>
            </div>
        </div>,
        document.body
    );
}
