import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export const initializeMap = (containerId: string, center: [number, number], zoom: number) => {
    const map = new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: zoom,
    });

    return map;
};

export const addMarker = (map: mapboxgl.Map, coordinates: [number, number], popupText: string) => {
    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setText(popupText))
        .addTo(map);
    
    return marker;
};

export const drawRoute = (map: mapboxgl.Map, route: [number, number][]) => {
    const geojson = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: route,
        },
    };

    map.addSource('route', {
        type: 'geojson',
        data: geojson,
    });

    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': '#888',
            'line-width': 8,
        },
    });
};

export const fitMapToBounds = (map: mapboxgl.Map, bounds: [[number, number], [number, number]]) => {
    map.fitBounds(bounds, {
        padding: 20,
    });
};