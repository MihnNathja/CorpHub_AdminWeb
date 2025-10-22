import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

/**
 * Kết nối WebSocket và gửi token qua STOMP header (không dùng query)
 */
export const connectNotificationSocket = (token, userId, onMessage) => {
    if (!token || !userId) {
        console.warn("⚠️ Missing token or userId");
        return;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        connectHeaders: {
            Authorization: `Bearer ${token}`, // ✅ Gửi token ở đây
        },
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("✅ Connected to WebSocket (STOMP header)");
            stompClient.subscribe(`/topic/users/${userId}`, (message) => {
                const notif = JSON.parse(message.body);
                console.log("🔔 [WS] Notification received:", notif);
                onMessage?.(notif);
            });
        },
        onStompError: (frame) => {
            console.error("❌ STOMP Error:", frame.headers["message"]);
        },
        onWebSocketClose: () => {
            console.warn("⚠️ WebSocket disconnected, will retry...");
        },
    });

    stompClient.activate();
};

export const disconnectNotificationSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        console.log("🔌 Disconnected from WebSocket");
        stompClient = null;
    }
};
