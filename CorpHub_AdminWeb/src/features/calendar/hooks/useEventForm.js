import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsersBySearch,
  clearSearchResults,
} from "../../user/store/userSlice";
import { confirmAttendMeeting, confirmMeetingReady } from "../store/calendarSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

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
    meetingRoom: false,
    roomRequirement: {
      id: null,
      capacity: 0,
      assetCategories: [],
      start: "",
      end: "",
      roomId: "",
    },
    onlineLink: "",
    start: "",
    end: "",
    ready: false,
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
        meetingRoom: slotInfo?.meetingRoom || false,
        roomRequirement: slotInfo?.roomRequirement || {
          id: null,
          capacity: 0,
          assetCategories: [],
          start: "",
          end: "",
          roomId: "",
        },
        onlineLink: slotInfo?.onlineLink || "",
        start: slotInfo?.start ? toInputString(slotInfo.start) : "",
        end: slotInfo?.end ? toInputString(slotInfo.end) : "",
        ready: slotInfo?.ready || false,
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
      showSuccess("ConfirmAttend Successfully");
    } catch (err) {
      showError("ConfirmAttend Error");
      console.error("ConfirmAttend Error:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleConfirmMeetingReady = async (id) => {
  setConfirmLoading(true);
  try {
    const ok = await dispatch(confirmMeetingReady(id)).unwrap(); // ok = true/false

    if (ok === true) {
      setForm((prev) => ({ ...prev, ready: true }));
      showSuccess("Confirm ready successfully");
    } else {
      showError("Confirm ready failed");
    }
  } catch (err) {
    showError("Confirm ready Error");
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
    handleConfirmMeetingReady,
  };
};
