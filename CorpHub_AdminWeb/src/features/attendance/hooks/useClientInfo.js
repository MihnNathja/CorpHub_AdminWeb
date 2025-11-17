// src/hooks/useClientInfo.js
import { useEffect, useState } from "react";

async function fetchIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch (err) {
        console.error("Error getting IP:", err);
        return null;
    }
}

export const useClientInfo = () => {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [ip, setIp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const getLocation = () =>
            new Promise((resolve) => {
                if (!navigator.geolocation) {
                    console.warn("Geolocation not supported");
                    resolve(null);
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        if (isMounted) {
                            setLat(pos.coords.latitude);
                            setLng(pos.coords.longitude);

                            console.log(
                                "Accuracy:",
                                pos.coords.accuracy,
                                "meters"
                            ); // debug độ chính xác
                        }
                        resolve(true);
                    },
                    (err) => {
                        console.warn("GPS blocked:", err);
                        resolve(false);
                    },
                    {
                        enableHighAccuracy: true, // 🔥 GPS chính xác cao
                        timeout: 15000,           // chờ sát 15s để bắt GPS
                        maximumAge: 0,            // luôn lấy vị trí mới
                    }
                );
            });

        const loadData = async () => {
            await getLocation();     // lấy tọa độ xong mới tiếp tục

            const clientIp = await fetchIP();
            if (isMounted) setIp(clientIp);

            if (isMounted) setLoading(false); // chỉ tắt loading sau khi đủ dữ liệu
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { lat, lng, ip, loading };
};

