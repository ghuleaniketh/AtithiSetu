import React, { useState } from "react";
import { MapPin, Search } from "lucide-react";

type Hotel = {
  id: string;
  name?: string;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
  distanceKm?: number;
  address?: string;
  photoUrl?: string; // added
};

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function fetchPlacePhotoUrl(lat: number, lon: number): Promise<string | undefined> {
  // Recommended: call your server endpoint that keeps the API key private.
  // Example client-side (NOT recommended for production):
  // 1) Nearby search for "lodging" to get place_id (or use place details if you have place_id)
  // 2) Use the photo_reference returned to build a Place Photo URL:
  //    https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=PHOTO_REF&key=YOUR_API_KEY
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY; // or call your server
    if (!apiKey) return undefined;
    const nearby = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=50&type=lodging&key=${apiKey}`
    ).then((r) => r.json());
    const first = nearby?.results?.[0];
    const photoRef = first?.photos?.[0]?.photo_reference;
    if (!photoRef) return undefined;
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${apiKey}`;
  } catch (err) {
    console.warn("photo fetch failed", err);
    return undefined;
  }
}

export default function HotelBookingPage(): JSX.Element {
  const [query, setQuery] = useState("Guntur");
  const [center, setCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function search() {
    setErr(null);
    setHotels([]);
    setLoading(true);
    try {
      // 1) Geocode the area (Nominatim)
      const gRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const gJson = await gRes.json();
      if (!gJson || gJson.length === 0) throw new Error("Could not locate place. Try a different query.");
      const lat = parseFloat(gJson[0].lat);
      const lon = parseFloat(gJson[0].lon);
      setCenter({ lat, lon });

      // 2) Overpass query to find hotels (nodes & ways)
      const radius = 5000; // 5 km
      const overpass = `
        [out:json][timeout:25];
        (
          node(around:${radius},${lat},${lon})[tourism=hotel];
          way(around:${radius},${lat},${lon})[tourism=hotel];
          node(around:${radius},${lat},${lon})[hotel];
        );
        out center 50;
      `;
      const oRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpass,
        headers: { "Content-Type": "text/plain" },
      });
      const oJson = await oRes.json();
      if (!oJson.elements || oJson.elements.length === 0) {
        setHotels([]);
        setLoading(false);
        return;
      }

      const found = oJson.elements.map((el) => {
        const latE = el.lat ?? (el.center && el.center.lat);
        const lonE = el.lon ?? (el.center && el.center.lon);
        const name = el.tags?.name ?? el.tags?.brand ?? el.tags?.operator;
        const addressParts = [
          el.tags?.["addr:housenumber"],
          el.tags?.["addr:street"],
          el.tags?.["addr:city"],
        ].filter(Boolean);
        const address = addressParts.join(", ") || undefined;
        const distanceKm = center ? haversine(center.lat, center.lon, latE, lonE) : undefined;
        return {
          id: `${el.type}-${el.id}`,
          name,
          lat: latE,
          lon: lonE,
          tags: el.tags,
          distanceKm: distanceKm ? Math.round(distanceKm * 100) / 100 : undefined,
          address,
        } as Hotel;
      });

      // sort by distance
      found.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
      setHotels(found);
    } catch (e: any) {
      console.error(e);
      setErr(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-muted/5 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
      <nav className="bg-white/80 dark:bg-slate-800/95 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3">
      
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full md:w-auto flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city / neighborhood / landmark"
              className="px-4 py-2 rounded-l-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
            <button
              onClick={search}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-r-md shadow hover:opacity-95"
            >
              <Search className="w-4 h-4" /> {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-white/80 dark:bg-slate-800/95 rounded-xl p-4 shadow">
              {err && <div className="text-sm text-red-400 mb-2">{err}</div>}
              {!center && <div className="text-sm text-muted-foreground dark:text-slate-300">Enter an area and click Search to find hotels nearby.</div>}

              {center && (
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground dark:text-slate-300">Map preview</div>
                  <div className="mt-2 rounded-md overflow-hidden border">
                    <iframe
                      title="area-map"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${center.lon - 0.05}%2C${center.lat - 0.04}%2C${center.lon + 0.05}%2C${center.lat + 0.04}&layer=mapnik&marker=${center.lat}%2C${center.lon}`}
                      style={{ width: "100%", height: 300, border: 0 }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {hotels.length === 0 && center && (
                  <div className="text-sm text-muted-foreground dark:text-slate-300">No hotels found nearby.</div>
                )}

                {/* parent grid with 3 columns on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hotels.map((h) => {
                    const hotelName = (h.name ?? "Unnamed Hotel").trim();
                    const rating = h.tags?.stars ?? h.tags?.rating;
                    const ratingNum = rating ? Math.min(5, Math.round(Number(rating) || 0)) : 0;
                    const stars = ratingNum ? "★".repeat(ratingNum) + "☆".repeat(5 - ratingNum) : "—";
                    const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
                      `${hotelName} ${query}`
                    )}`;

                    return (
                      <div
                        key={h.id}
                        className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow"
                      >
                        {/* visual square header (uses aspect-square utility) */}
                        <div className="aspect-square bg-gradient-to-tr from-primary/20 to-indigo-100 dark:from-primary/10 dark:to-indigo-800 flex items-end p-3">
                          <div className="bg-white/60 dark:bg-slate-800/70 rounded-md px-2 py-1 text-xs font-medium">
                            {stars} {rating ? <span className="ml-2 text-xs">({rating})</span> : null}
                          </div>
                        </div>

                        <div className="p-4 flex flex-col h-40">
                          <div className="flex-1">
                            <div className="font-semibold text-lg dark:text-slate-100">{hotelName}</div>
                            <div className="text-xs text-muted-foreground dark:text-slate-300 mt-1">
                              {h.address ?? h.tags?.street ?? "Address not available"}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <a
                              href={bookingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center px-3 py-2 rounded bg-primary text-white text-sm shadow"
                            >
                              Book
                            </a>
                            <a
                              href={`https://www.openstreetmap.org/?mlat=${h.lat}&mlon=${h.lon}#map=18/${h.lat}/${h.lon}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded border bg-white dark:bg-slate-800 text-sm"
                            >
                              Map
                            </a>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                `${h.lat},${h.lon}`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 text-xs rounded text-muted-foreground dark:text-slate-300"
                              title="Directions"
                            >
                              → Directions
                            </a>
                          </div>

                          <div className="mt-2 text-xs text-muted-foreground dark:text-slate-300 flex justify-between">
                            <div>{h.distanceKm ? `${h.distanceKm} km` : "--"} <span className="ml-1 text-[10px]">approx.</span></div>
                            <div className="text-right">{h.tags?.["stars"] ?? h.tags?.rating ?? "—"}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="bg-white/80 dark:bg-slate-800/95 rounded-xl p-4 shadow">
              <h3 className="font-semibold dark:text-slate-100">Tips</h3>
              <ul className="text-sm mt-2 text-muted-foreground dark:text-slate-300 space-y-2">
                <li>• Use neighborhood or landmark names for better results.</li>
                <li>• Click "Book" to open booking.com search for the hotel (demo link).</li>
                <li>• Map preview uses OpenStreetMap & Overpass public APIs — rate limits apply.</li>
              </ul>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/95 rounded-xl p-4 shadow">
              <h4 className="font-semibold dark:text-slate-100">Quick actions</h4>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setQuery("Hyderabad");
                    search();
                  }}
                  className="px-3 py-2 rounded bg-primary text-white"
                >
                  Search Hyderabad
                </button>
                <button
                  onClick={() => {
                    setQuery("Visakhapatnam");
                    search();
                  }}
                  className="px-3 py-2 rounded border bg-white dark:bg-slate-700"
                >
                  Search Visakhapatnam
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}