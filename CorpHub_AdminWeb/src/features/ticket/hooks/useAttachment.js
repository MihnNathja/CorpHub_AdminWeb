import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  fetchTicketAttachments,
  addTicketAttachments,
  removeTicketAttachment,
  downloadTicketAttachment,
} from "../store/attachmentSlice";

export const useAttachments = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.attachments);

  const load = useCallback(
    (ticketId) => dispatch(fetchTicketAttachments(ticketId)),
    [dispatch]
  );

  const upload = useCallback(
    (ticketId, files) =>
      dispatch(addTicketAttachments({ ticketId, files })).unwrap(),
    [dispatch]
  );

  const remove = useCallback(
    (attachmentId) => dispatch(removeTicketAttachment(attachmentId)).unwrap(),
    [dispatch]
  );

  const download = useCallback(
    async (attachmentId) => {
      await dispatch(downloadTicketAttachment(attachmentId));
    },
    [dispatch]
  );

  return {
    items,
    loading,
    error,
    load,
    upload,
    remove,
    download,
  };
};
