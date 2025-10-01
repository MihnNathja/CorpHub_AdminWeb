import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketComments, createTicketComment } from "../store/commentSlice";

export const useComment = (ticketId) => {
    const dispatch = useDispatch();
    const { commentItems, commentLoading, commentError } = useSelector(
        (state) => state.comments
    );

    // load comments khi ticketId thay đổi
    useEffect(() => {
        if (ticketId) {
            dispatch(fetchTicketComments(ticketId));
        }
    }, [dispatch, ticketId]);

    const refreshComments = useCallback(() => {
        if (ticketId) {
            dispatch(fetchTicketComments(ticketId));
        }
    }, [dispatch, ticketId]);

    // thêm comment gốc hoặc reply
    const addComment = useCallback(
        async (commentText, parentId = null) => {
            if (!ticketId || !commentText.trim()) return;

            await dispatch(
                createTicketComment({
                    ticketId,
                    commentText,
                    parentId,
                })
            );

        },
        [dispatch, ticketId]
    );

    return {
        comments: commentItems,
        loading: commentLoading,
        error: commentError,
        refreshComments,
        addComment,
    };
};
