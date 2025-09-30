import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersBySearch, clearSearchResults } from "../../user/store/userSlice";
import { confirmAttendMeeting } from "../store/calendarSlice";

function toInputString(dateLike) {
    if (!dateLike) return "";
    return new Date(dateLike).toISOString().slice(0, 16);
}

export const useEventForm = (isOpen, slotInfo) => {
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
    const [status, setStatus] = useState("PENDING");
    const [confirmLoading, setConfirmLoading] = useState(false);

    // Prefill khi mở modal
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

            // Prefill attendees
            if (slotInfo?.attendees?.length) {
                setRecipients(
                    slotInfo.attendees.map((a) => ({
                        email: a.email,
                        name: a.email.split("@")[0],
                        status: a.status,
                    }))
                );
            } else {
                setRecipients([]);
            }

            // Prefill status
            setStatus(slotInfo?.status || "PENDING");

            setQuery("");
            setErrors({});
            dispatch(clearSearchResults());
        }
    }, [isOpen, slotInfo, dispatch]);

    // API search user
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

    // Xử lý khi chọn trạng thái
    const handleSelectStatus = async (newStatus) => {
        setStatus(newStatus);
        if (!slotInfo?.id) return;
        setConfirmLoading(true);
        try {
            await dispatch(
                confirmAttendMeeting({
                    id: slotInfo.id,
                    isAccepted: newStatus === "ACCEPTED",
                })
            ).unwrap();
        } catch (err) {
            console.error("❌ Lỗi confirmAttend:", err);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddRecipient = (item) => {
        console.log(item);
        const email = (item.email || "").trim();
        const displayName = item.fullName || item.name || "";
        if (!email) return;

        if (!recipients.some((r) => r.email === email)) {
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

    return {
        form,
        setForm,
        recipients,
        setRecipients,
        query,
        setQuery,
        errors,
        setErrors,
        suggestions,
        loading,
        status,
        confirmLoading,
        handleSelectStatus,
        handleChange,
        handleAddRecipient,
        handleRemoveRecipient,
        validate,
    };
};
