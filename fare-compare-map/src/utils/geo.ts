import { LatLng } from 'leaflet';

export const getCoordinatesFromAddress = async (address: string): Promise<LatLng | null> => {
    // Implement logic to convert address to coordinates using a geocoding API
    // For example, you can use the Mapbox Geocoding API or any other service
    // Return the coordinates as LatLng or null if not found
};

export const calculateDistance = (start: LatLng, end: LatLng): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = degreesToRadians(end.lat - start.lat);
    const dLon = degreesToRadians(end.lng - start.lng);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(start.lat)) * Math.cos(degreesToRadians(end.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

const degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
};