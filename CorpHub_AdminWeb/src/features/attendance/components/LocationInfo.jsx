import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import FixMapRender from "./FixMapRender";
import { useClientInfo } from "../hooks/useClientInfo";

export default function LocationInfo() {
    const { lat, lng, loading } = useClientInfo();
    const [address, setAddress] = useState("Đang lấy vị trí...");

    // Reverse geocoding dựa trên lat/lng
    useEffect(() => {
        if (!lat || !lng) return;

        const fetchAddress = async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                );
                const data = await res.json();
                setAddress(data.display_name || "Không tìm thấy địa chỉ");
            } catch (err) {
                setAddress("Lỗi khi lấy địa chỉ từ tọa độ");
            }
        };

        fetchAddress();
    }, [lat, lng]);

    const markerIcon = new L.Icon({
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow space-y-3">
            <h2 className="text-xl font-bold mb-2">Vị trí hiện tại</h2>

            {/* Loading */}
            {loading && (
                <p className="text-sm opacity-80">Đang lấy vị trí...</p>
            )}

            {/* Địa chỉ */}
            {!loading && <p className="text-sm opacity-80">{address}</p>}

            {/* Map */}
            {lat && lng && (
                <div className="relative h-64 w-full rounded-xl overflow-hidden">
                    <MapContainer
                        center={[lat, lng]}
                        zoom={16}
                        scrollWheelZoom={false}
                        className="absolute inset-0 !h-full !w-full"
                    >
                        <FixMapRender />
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        <Marker position={[lat, lng]} icon={markerIcon}>
                            <Popup>Bạn đang ở đây</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </div>
    );
}
