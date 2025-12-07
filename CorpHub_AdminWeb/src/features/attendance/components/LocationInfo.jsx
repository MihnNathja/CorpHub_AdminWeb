import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Loader, AlertCircle, CheckCircle2, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import FixMapRender from "./FixMapRender";
import { useClientInfo } from "../hooks/useClientInfo";

export default function LocationInfo() {
    const { lat, lng, ip, loading } = useClientInfo();
    const [address, setAddress] = useState("Đang lấy vị trí...");
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressError, setAddressError] = useState(false);

    // Reverse geocoding dựa trên lat/lng
    useEffect(() => {
        if (!lat || !lng) return;

        const fetchAddress = async () => {
            setAddressLoading(true);
            setAddressError(false);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
                );
                const data = await res.json();
                setAddress(data.display_name || "Không tìm thấy địa chỉ");
            } catch (err) {
                setAddress("Lỗi khi lấy địa chỉ từ tọa độ");
                setAddressError(true);
            } finally {
                setAddressLoading(false);
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
        <div className="space-y-4">
            {/* Location Status Banner */}
            {loading ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center gap-3"
                >
                    <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                            Đang lấy vị trí...
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                            Vui lòng cấp quyền truy cập vị trí
                        </p>
                    </div>
                </motion.div>
            ) : lat && lng ? (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3"
                >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                            Vị trí đã được xác định
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                            Tọa độ: {lat.toFixed(6)}, {lng.toFixed(6)}
                        </p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100">
                            Không thể lấy vị trí
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                            Vui lòng kiểm tra cài đặt quyền truy cập
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Location Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Coordinates */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            Tọa độ
                        </p>
                    </div>
                    {lat && lng ? (
                        <div className="space-y-1">
                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                                Lat: {lat.toFixed(6)}
                            </p>
                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                                Lng: {lng.toFixed(6)}
                            </p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">N/A</p>
                    )}
                </div>

                {/* IP Address */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Wifi className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                            IP Address
                        </p>
                    </div>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                        {ip || "Đang lấy..."}
                    </p>
                </div>
            </div>

            {/* Address Display */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Địa chỉ
                    </p>
                </div>
                {addressLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang tìm địa chỉ...</span>
                    </div>
                ) : addressError ? (
                    <p className="text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {address}
                    </p>
                ) : (
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {address}
                    </p>
                )}
            </div>

            {/* Map Display */}
            {lat && lng && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                >
                    {/* Map Header */}
                    <div className="absolute top-0 left-0 right-0 z-[500] bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-semibold">Vị trí của bạn</span>
                    </div>

                    {/* Map Container */}
                    <div className="h-80 w-full mt-10">
                        <MapContainer
                            center={[lat, lng]}
                            zoom={16}
                            scrollWheelZoom={false}
                            className="absolute inset-0 !h-full !w-full"
                        >
                            <FixMapRender />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />

                            <Marker position={[lat, lng]} icon={markerIcon}>
                                <Popup>
                                    <div className="text-center space-y-1">
                                        <p className="font-semibold text-sm">📍 Bạn đang ở đây</p>
                                        <p className="text-xs text-gray-600">
                                            {lat.toFixed(6)}, {lng.toFixed(6)}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>

                    {/* Map Footer Info */}
                    <div className="absolute bottom-0 left-0 right-0 z-[500] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            ℹ️ Nhấn vào marker để xem thông tin chi tiết
                        </p>
                    </div>
                </motion.div>
            )}

            {/* No Location Available */}
            {!loading && !lat && !lng && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center space-y-3"
                >
                    <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto" />
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">
                            Không có dữ liệu vị trí
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Vui lòng cho phép truy cập vị trí trong trình duyệt
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
