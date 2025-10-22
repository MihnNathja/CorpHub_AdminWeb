import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMyTickets,
  fetchReceivedTickets,
  fetchSentTickets,
  fetchUsersDepartment,
  assign,
  confirmSend,
  reject,
  createOrUpdateTicket,
  accept,
  complete,
  remove,
} from "../store/ticketSlice";
import { showError, showSuccess } from "../../../utils/toastUtils";

export const useTickets = (mode = "my") => {
  const dispatch = useDispatch();

  // 🔹 Lấy nhánh state tương ứng
  const {
    data: tickets = [],
    meta = {},
    loading,
    error,
  } = useSelector((state) => state.tickets[mode]);
  const users = useSelector((state) => state.tickets.users);

  // ====================== LOCAL FILTER STATE ======================
  const [page, setPage] = useState(meta.page ?? 0);
  const [size, setSize] = useState(meta.size ?? 9);
  const [isRequester, setIsRequester] = useState(true);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [keyword, setKeyword] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReasonFormOpen, setIsReasonFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(false);

  const totalPages = meta.totalPages ?? 1;

  // ====================== FETCH FUNCTION ======================
  const fetchTickets = useCallback(() => {
    const params = {
      page,
      size,
      isRequester,
      status,
      priority,
      from,
      to,
      keyword,
    };

    if (mode === "sent") dispatch(fetchSentTickets(params));
    else if (mode === "received") dispatch(fetchReceivedTickets(params));
    else dispatch(fetchMyTickets(params));
  }, [
    dispatch,
    mode,
    page,
    size,
    isRequester,
    status,
    priority,
    from,
    to,
    keyword,
  ]);

  // Gọi mỗi khi filter hoặc phân trang thay đổi
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // 🧩 Fetch users (cho phần Assign)
  useEffect(() => {
    if (!Array.isArray(users) || users.length === 0) {
      dispatch(fetchUsersDepartment());
    }
  }, [dispatch]);

  // ====================== ACTION HANDLERS ======================
  const handleAssign = async (ticketId, userId) => {
    try {
      await dispatch(assign({ ticketId, userId }));
      showSuccess("Assign successfully");
      fetchTickets();
    } catch (err) {
      showError("Assign failed");
      console.error(err);
    }
  };

  const handleConfirmSend = async (ticketId) => {
    try {
      await dispatch(confirmSend({ ticketId }));
      showSuccess("Confirm successfully");
      fetchTickets();
    } catch (err) {
      showError("Confirm failed");
      console.error(err);
    }
  };

  const handleReject = async (ticketId, reason) => {
    try {
      await dispatch(reject({ ticketId, reason }));
      showSuccess("Reject successfully");
      fetchTickets();
    } catch (err) {
      showError("Reject failed");
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async (ticketData) => {
    try {
      await dispatch(createOrUpdateTicket(ticketData)).unwrap();
      showSuccess(ticketData.id ? "Ticket updated" : "Ticket created");
      fetchTickets();
      return { success: true };
    } catch (err) {


      if (err?.data && typeof err.data === "object") {
        console.error("Save ticket failed:", err.data);
        return { success: false, validationErrors: err.data };
      }

      showError(err?.message || "Save ticket failed");
      return { success: false };
    }
  };

  const handleAccept = async (ticketId) => {
    try {
      await dispatch(accept(ticketId));
      showSuccess("Ticket accepted");
      fetchTickets();
    } catch (err) {
      showError("Accept failed");
      console.error(err);
    }
  };

  const handleComplete = async (ticketId) => {
    try {
      await dispatch(complete(ticketId));
      showSuccess("Ticket completed");
      fetchTickets();
    } catch (err) {
      showError("Complete failed");
      console.error(err);
    }
  };

  const handleRemove = async (ticketId) => {
    try {
      await dispatch(remove(ticketId));
      showSuccess("Ticket deleted");
      fetchTickets();
    } catch (err) {
      showError("Delete failed");
      console.error(err);
    }
  };

  // ====================== RETURN ======================
  return {
    tickets,
    users,
    loading,
    error,

    // Pagination
    page,
    setPage,
    totalPages,
    size,
    setSize,

    // Filters
    status,
    setStatus,
    isRequester,
    setIsRequester,
    priority,
    setPriority,
    from,
    setFrom,
    to,
    setTo,
    keyword,
    setKeyword,

    // Modal & Ticket selection ✅
    selectedTicket,
    setSelectedTicket,
    isModalOpen,
    setIsModalOpen,
    isReasonFormOpen,
    setIsReasonFormOpen,
    editingId,
    setEditingId,

    // Actions
    handleAssign,
    handleConfirmSend,
    handleReject,
    handleCreateOrUpdate,
    handleAccept,
    handleComplete,
    handleRemove,
  };
};
