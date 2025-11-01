import { useEffect, useRef } from "react";
import { Map, TileLayer, Marker, Polyline } from "react-leaflet"; // Assuming Leaflet is being used
import L from "leaflet";

const useMap = (from: string, to: string) => {
    const mapRef = useRef<L.Map | null>(null);
    const routeRef = useRef<L.Polyline | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([0, 0], 2); // Initial view
        }
    }, []);

    const initializeMap = (mapElement: HTMLDivElement) => {
        mapRef.current = L.map(mapElement).setView([0, 0], 2); // Set initial view
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(mapRef.current);
    };

    const updateRoute = (fromCoords: [number, number], toCoords: [number, number]) => {
        if (routeRef.current) {
            mapRef.current?.removeLayer(routeRef.current);
        }

        routeRef.current = L.polyline([fromCoords, toCoords], { color: "blue" }).addTo(mapRef.current);
        mapRef.current?.fitBounds(routeRef.current.getBounds());
    };

    return { initializeMap, updateRoute };
};

export default useMap;