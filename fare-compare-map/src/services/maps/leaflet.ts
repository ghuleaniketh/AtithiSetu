import L from 'leaflet';

export const initializeMap = (mapContainer: HTMLElement, center: [number, number], zoom: number) => {
    const map = L.map(mapContainer).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    return map;
};

export const addMarker = (map: L.Map, position: [number, number], title: string) => {
    L.marker(position).addTo(map).bindPopup(title).openPopup();
};

export const drawRoute = (map: L.Map, waypoints: [number, number][]) => {
    const polyline = L.polyline(waypoints, { color: 'blue' }).addTo(map);
    map.fitBounds(polyline.getBounds());
};