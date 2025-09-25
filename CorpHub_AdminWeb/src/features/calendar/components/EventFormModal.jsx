import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersBySearch, clearSearchResults } from "../../user/store/userSlice";
import RecipientInput from "./RecipientInput";
import UserSuggestions from "./UserSuggestions";

// Helper: convert Date → "yyyy-MM-ddTHH:mm" cho <input type="datetime-local">
function toInputString(dateLike) {
    if (!dateLike) return "";
    return new Date(dateLike).toISOString().slice(0, 16);
}


export default function EventFormModal({ isOpen, onClose, onSubmit, slotInfo }) {
    const dispatch = useDispatch();
    const suggestions = useSelector((state) => state.user.searchResults || []);
    const loading = useSelector((state) => state.user.loading);

    const [form, setForm] = useState({
        subject: "",
        title: "",
        description: "",
        location: "",
        onlineLink: "",
        start: "",
        end: "",
    });

    const [recipients, setRecipients] = useState([]);
    const [query, setQuery] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Prefill khi mở modal (Add hoặc Edit)
    useEffect(() => {
        if (isOpen) {
            setForm({
                id: slotInfo?.id || "",
                subject: slotInfo?.subject || "",
                title: slotInfo?.title || "",
                description: slotInfo?.description || "",
                location: slotInfo?.location || "",
                onlineLink: slotInfo?.onlineLink || "",
                start: slotInfo?.start ? toInputString(slotInfo.start) : "",
                end: slotInfo?.end ? toInputString(slotInfo.end) : "",
            });

            if (slotInfo?.attendeesEmails?.length) {
                setRecipients(
                    slotInfo.attendeesEmails.map((email) => ({
                        email,
                        name: email.split("@")[0],
                    }))
                );
            } else {
                setRecipients([]);
            }

            setQuery("");
            setErrors({});
            dispatch(clearSearchResults());
        }
    }, [isOpen, slotInfo, dispatch]);

    // Gọi API tìm kiếm khi gõ
    useEffect(() => {
        const debounce = setTimeout(() => {
            if (query.trim()) {
                dispatch(fetchUsersBySearch(query));
            } else {
                dispatch(clearSearchResults());
            }
        }, 300);
        return () => clearTimeout(debounce);
    }, [query, dispatch]);

    const handleAddRecipient = (item) => {
        const email = (item.email || "").trim().toLowerCase();
        const displayName = item.fullName || item.name || "";
        if (!email) return;

        if (!recipients.some((r) => r.email.toLowerCase() === email)) {
            setRecipients((prev) => [...prev, { email, name: displayName }]);
        }
        setQuery("");
        dispatch(clearSearchResults());
    };

    const handleRemoveRecipient = (email) => {
        setRecipients((prev) => prev.filter((r) => r.email !== email));
    };

    const validate = () => {
        const err = {};
        if (!form.title.trim()) err.title = "Event title is required";
        if (!form.start) err.start = "Start time required";
        if (!form.end) err.end = "End time required";

        const startDate = form.start ? new Date(form.start) : null;
        const endDate = form.end ? new Date(form.end) : null;
        if (startDate && endDate && startDate >= endDate) {
            err.range = "End time must be after start time";
        }

        if (!recipients.length) err.to = "At least one recipient required";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                    {slotInfo?.id ? "Edit Meeting" : "Create Meeting"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <UserSuggestions suggestions={suggestions} onSelect={handleAddRecipient} />
                    {errors.to && <p className="text-sm text-red-500">{errors.to}</p>}

                    <input
                        type="text"
                        name="subject"
                        placeholder="Email subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                        type="text"
                        name="title"
                        placeholder="Event title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                        type="text"
                        name="onlineLink"
                        placeholder="Online meeting link"
                        value={form.onlineLink}
                        onChange={handleChange}
                        className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Start</label>
                            <input
                                type="datetime-local"
                                name="start"
                                value={form.start}
                                onChange={handleChange}
                                className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.start && <p className="text-sm text-red-500">{errors.start}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">End</label>
                            <input
                                type="datetime-local"
                                name="end"
                                value={form.end}
                                onChange={handleChange}
                                className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            {errors.end && <p className="text-sm text-red-500">{errors.end}</p>}
                        </div>
                    </div>
                    {errors.range && <p className="text-sm text-red-500">{errors.range}</p>}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
