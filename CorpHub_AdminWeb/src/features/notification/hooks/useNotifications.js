import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../store/notificationSlice";
import {
    connectNotificationSocket,
    disconnectNotificationSocket,
} from "../socket/notificationSocket";

/**
 * Hook quản lý kết nối WebSocket để nhận thông báo realtime
 * @param {string} token - JWT của người dùng hiện tại
 * @param {string} userId - ID người dùng hiện tại
 */
export const useNotifications = (token, userId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token || !userId) return;

        // ✅ Kết nối WS với token + userId
        connectNotificationSocket(token, userId, (notif) => {
            dispatch(addNotification(notif));
        });

        return () => {
            disconnectNotificationSocket();
        };
    }, [token, userId, dispatch]);
};
