import React from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RouteLayerProps {
    from: [number, number]; // [latitude, longitude]
    to: [number, number]; // [latitude, longitude]
}

const RouteLayer: React.FC<RouteLayerProps> = ({ from, to }) => {
    const positions = [from, to];

    return (
        <MapContainer center={from} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={positions} color="blue" />
        </MapContainer>
    );
};

export default RouteLayer;