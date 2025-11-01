import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";

interface MapViewProps {
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
}

const MapView: React.FC<MapViewProps> = ({ from, to, fromCoords, toCoords }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(fromCoords, 13);
    }
  }, [fromCoords]);

  return (
    <MapContainer center={fromCoords} zoom={13} ref={mapRef} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={fromCoords} />
      <Marker position={toCoords} />
      <Polyline positions={[fromCoords, toCoords]} color="blue" />
    </MapContainer>
  );
};

export default MapView;