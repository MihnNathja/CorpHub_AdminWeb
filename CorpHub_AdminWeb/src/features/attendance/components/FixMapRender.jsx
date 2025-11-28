import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function FixMapRender() {
    const map = useMap();

    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);

    return null;
}
