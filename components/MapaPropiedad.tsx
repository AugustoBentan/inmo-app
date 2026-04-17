"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Pin rojo SVG — evita el problema del ícono por defecto de Leaflet con webpack
const pinRojo = new L.DivIcon({
  className: "",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
      <path
        fill="#dc2626"
        stroke="white"
        stroke-width="1.5"
        d="M16 2C9.37 2 4 7.37 4 14c0 9.5 12 28 12 28S28 23.5 28 14C28 7.37 22.63 2 16 2z"
      />
      <circle fill="white" cx="16" cy="14" r="5.5"/>
    </svg>`,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -46],
});

type Props = {
  lat: number;
  lng: number;
  titulo?: string;
};

export default function MapaPropiedad({ lat, lng, titulo }: Props) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[lat, lng]} icon={pinRojo}>
        {titulo && (
          <Popup>
            <span className="text-sm font-semibold">{titulo}</span>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
}
