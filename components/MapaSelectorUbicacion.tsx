"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Pin rojo reutilizable ────────────────────────────────────────────────────
const pinRojo = new L.DivIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="32" height="44">
    <path fill="#dc2626" stroke="white" stroke-width="1.5"
      d="M16 2C9.37 2 4 7.37 4 14c0 9.5 12 28 12 28S28 23.5 28 14C28 7.37 22.63 2 16 2z"/>
    <circle fill="white" cx="16" cy="14" r="5.5"/>
  </svg>`,
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -46],
});

// ─── Subcomponente: captura clics en el mapa ──────────────────────────────────
function ClickHandler({ onPlace }: { onPlace: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Subcomponente: vuela suavemente a una posición ───────────────────────────
function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16, { duration: 1.2 });
  }, [position, map]);
  return null;
}

// ─── Tipos Nominatim ──────────────────────────────────────────────────────────
type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

// ─── Props ────────────────────────────────────────────────────────────────────
type Props = {
  lat: number | null;
  lng: number | null;
  direccionInicial?: string;
  onChange: (lat: number | null, lng: number | null) => void;
};

const CENTRO_DEFAULT: [number, number] = [-31.4135, -64.1811]; // Córdoba, Argentina

export default function MapaSelectorUbicacion({ lat, lng, direccionInicial, onChange }: Props) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [flyTo, setFlyTo]       = useState<[number, number] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  const center: [number, number] =
    lat != null && lng != null ? [lat, lng] : CENTRO_DEFAULT;
  const zoom = lat != null ? 15 : 12;

  // ── Búsqueda Nominatim con debounce ──
  useEffect(() => {
    if (debounceRef.current != null) clearTimeout(debounceRef.current);
    if (query.trim().length < 3) { setResults([]); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=ar`;
        const res = await fetch(url, { headers: { "Accept-Language": "es" } });
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => { if (debounceRef.current != null) clearTimeout(debounceRef.current); };
  }, [query]);

  // ── Cerrar dropdown al hacer clic afuera ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelectResult(r: NominatimResult) {
    const newLat = parseFloat(r.lat);
    const newLng = parseFloat(r.lon);
    onChange(newLat, newLng);
    setFlyTo([newLat, newLng]);
    setQuery(r.display_name.split(",").slice(0, 2).join(","));
    setResults([]);
    setShowResults(false);
  }

  function handleUsarDireccion() {
    if (direccionInicial?.trim()) {
      setQuery(direccionInicial.trim());
    }
  }

  function handlePlace(newLat: number, newLng: number) {
    onChange(newLat, newLng);
    setFlyTo(null);
  }

  return (
    <div className="flex flex-col gap-3">

      {/* ── Buscador de dirección ── */}
      <div ref={wrapperRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              placeholder="Buscar dirección en el mapa…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            {searching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              </span>
            )}
          </div>

          {direccionInicial && (
            <button
              type="button"
              onClick={handleUsarDireccion}
              title="Geocodificar la dirección cargada en el formulario"
              className="whitespace-nowrap rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
            >
              Usar dirección ↑
            </button>
          )}
        </div>

        {/* ── Dropdown de resultados ── */}
        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[1000] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
            {results.map((r) => (
              <button
                key={r.place_id}
                type="button"
                onClick={() => handleSelectResult(r)}
                className="flex w-full items-start gap-2 border-b border-gray-100 px-4 py-3 text-left text-sm text-gray-700 last:border-0 hover:bg-blue-50 transition-colors"
              >
                <span className="mt-0.5 shrink-0 text-blue-500">📍</span>
                <span className="leading-snug">{r.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mapa interactivo ── */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm sm:h-80">
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickHandler onPlace={handlePlace} />
          <FlyTo position={flyTo} />
          {lat != null && lng != null && (
            <Marker
              position={[lat, lng]}
              icon={pinRojo}
              draggable
              eventHandlers={{
                dragend(e) {
                  const pos = (e.target as L.Marker).getLatLng();
                  onChange(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>

        {/* Ayuda flotante sobre el mapa */}
        {lat == null && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-[500]">
            <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Hacé clic para colocar el marcador
            </span>
          </div>
        )}
      </div>

      {/* ── Coordenadas capturadas ── */}
      {lat != null && lng != null ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <span className="text-emerald-600 shrink-0">✓</span>
          <span className="flex-1 font-mono text-xs text-gray-700">
            Lat: <strong>{lat.toFixed(6)}</strong> &nbsp;|&nbsp; Lng: <strong>{lng.toFixed(6)}</strong>
          </span>
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="text-xs font-semibold text-red-500 transition-colors hover:text-red-700"
          >
            Quitar
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          Podés también arrastrar el marcador para ajustar la posición con precisión.
        </p>
      )}
    </div>
  );
}
