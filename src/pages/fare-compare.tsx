import  { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";

type Provider = "OLA" | "Uber" | "Rapido";
type FareResult = { provider: Provider; price: number; etaMin: number; surge: boolean; note?: string };

/**
 * Small demo fare generator (keeps page functional without provider APIs)
 */
const mockCompare = (from: string, to: string): FareResult[] => [
	{ provider: "OLA", price: Math.round(80 + Math.random() * 120), etaMin: 4 + Math.round(Math.random() * 6), surge: Math.random() > 0.8, note: "Comfortable" },
	{ provider: "Uber", price: Math.round(85 + Math.random() * 140), etaMin: 3 + Math.round(Math.random() * 8), surge: Math.random() > 0.75, note: "Popular" },
	{ provider: "Rapido", price: Math.round(60 + Math.random() * 100), etaMin: 5 + Math.round(Math.random() * 7), surge: Math.random() > 0.85, note: "Bike option" },
];

/**
 * Simple Nominatim geocode (demo). For production use a backend proxy and respect rate limits.
 */
async function geocode(query: string) {
	const q = encodeURIComponent(query);
	const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`);
	const data = await res.json();
	if (!Array.isArray(data) || data.length === 0) return null;
	return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
}

/**
 * Dynamically load Leaflet css + script from CDN so we don't require npm installs.
 * Returns the global L when ready.
 */
function loadLeaflet(): Promise<any> {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined") return reject(new Error("No window"));
		// already loaded?
		// @ts-ignore
		if ((window as any).L) return resolve((window as any).L);

		// add css
		const cssHref = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
		if (!document.querySelector(`link[href="${cssHref}"]`)) {
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = cssHref;
			document.head.appendChild(link);
		}

		// add script
		const scriptSrc = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
		if (document.querySelector(`script[src="${scriptSrc}"]`)) {
			// wait until L exists
			const wait = () => {
				// @ts-ignore
				if ((window as any).L) resolve((window as any).L);
				else setTimeout(wait, 50);
			};
			wait();
			return;
		}

		const script = document.createElement("script");
		script.src = scriptSrc;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			// @ts-ignore
			if ((window as any).L) resolve((window as any).L);
			else reject(new Error("Leaflet loaded but L not found"));
		};
		script.onerror = () => reject(new Error("Failed to load leaflet script"));
		document.body.appendChild(script);
	});
}

export default function FareComparePage(): JSX.Element {
	const navigate = useNavigate();
	const [from, setFrom] = useState("Current location");
	const [to, setTo] = useState("Guntur");
	const [results, setResults] = useState<FareResult[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [chosen, setChosen] = useState<Provider | null>(null);

	const mapRef = useRef<any>(null);
	const markersRef = useRef<any[]>([]);
	const routeLayerRef = useRef<any>(null);

	const mapContainerId = "fare-map";

	useEffect(() => {
		let mounted = true;
		loadLeaflet()
			.then((L) => {
				if (!mounted) return;
				// init map only once
				if (!mapRef.current) {
					mapRef.current = L.map(mapContainerId, { zoomControl: true, attributionControl: false }).setView([17.385, 78.4867], 11);
					L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
						maxZoom: 19,
						attribution: "© OpenStreetMap contributors",
					}).addTo(mapRef.current);
				}
			})
			.catch((err) => {
				console.warn("Leaflet load failed", err);
			});
		return () => {
			mounted = false;
			if (mapRef.current) {
				try {
					mapRef.current.remove();
				} catch {}
				mapRef.current = null;
			}
		};
	}, []);

	const runCompare = async () => {
		setLoading(true);
		setChosen(null);
		setResults(null);

		try {
			// resolve origin: allow "Current location" fallback to browser geolocation
			let originCoords = null;
			if (from.trim().toLowerCase() === "current location" || from.trim().toLowerCase() === "currentlocation") {
				originCoords = await new Promise<{ lat: number; lon: number }>((resolve, reject) => {
					if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
					navigator.geolocation.getCurrentPosition(
						(pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
						(err) => reject(err),
						{ timeout: 10000 }
					);
				}).catch(() => null);
			}

			const geocodePromises = [];
			if (originCoords) geocodePromises.push(Promise.resolve({ lat: originCoords.lat, lon: originCoords.lon, display_name: "Current location" }));
			else geocodePromises.push(geocode(from));
			geocodePromises.push(geocode(to));

			const [o, d] = await Promise.all(geocodePromises);

			if (!o || !d) {
				alert("Couldn't geocode one or both locations. Try more specific text or allow location access.");
				setLoading(false);
				return;
			}

			// draw markers + route on map (no npm leaflet - dynamic CDN)
			// dynamic access to L
			// @ts-ignore
			const L = (window as any).L;
			if (!L || !mapRef.current) {
				alert("Map not ready. Try again in a moment.");
				setLoading(false);
				return;
			}

			// clear old markers / route
			markersRef.current.forEach((m) => {
				try {
					mapRef.current.removeLayer(m);
				} catch {}
			});
			markersRef.current = [];
			if (routeLayerRef.current) {
				try {
					mapRef.current.removeLayer(routeLayerRef.current);
				} catch {}
				routeLayerRef.current = null;
			}

			const originMarker = L.marker([o.lat, o.lon]).addTo(mapRef.current).bindPopup(o.display_name || "Origin");
			const destMarker = L.marker([d.lat, d.lon]).addTo(mapRef.current).bindPopup(d.display_name || "Destination");
			markersRef.current.push(originMarker, destMarker);

			// fetch route from OSRM demo server (geojson)
			try {
				const r = await fetch(
					`https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}?overview=full&geometries=geojson`
				);
				const jr = await r.json();
				if (jr?.routes?.length) {
					const coords: [number, number][] = jr.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
					routeLayerRef.current = L.polyline(coords, { color: "#2563eb", weight: 5, opacity: 0.9 }).addTo(mapRef.current);
					const bounds = L.latLngBounds(coords);
					mapRef.current.fitBounds(bounds.pad(0.1));
				} else {
					// fallback to fit origin/dest
					mapRef.current.fitBounds(L.latLngBounds([[o.lat, o.lon], [d.lat, d.lon]]).pad(0.2));
					routeLayerRef.current = null;
				}
			} catch (e) {
				console.warn("OSRM route fetch failed", e);
				mapRef.current.fitBounds(L.latLngBounds([[o.lat, o.lon], [d.lat, d.lon]]).pad(0.2));
			}

			// set demo fare results
			setResults(mockCompare(from, to));
		} catch (err) {
			console.error(err);
			alert("Error while getting locations. Make sure you allowed location access or try different addresses.");
		} finally {
			setLoading(false);
		}
	};

	const bestPrice = useMemo(() => {
		if (!results?.length) return null;
		return Math.min(...results.map((r) => r.price));
	}, [results]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-muted/5 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
			<header className="py-8">
				<div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="text-center md:text-left">
						<div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-tr from-primary/20 to-info/20 shadow-sm mb-3">
							<MapPin className="w-7 h-7 text-primary" />
						</div>
						<h1 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-indigo-300">Faring — Map & Compare</h1>
						<p className="text-muted-foreground dark:text-slate-300 max-w-xl mt-2">Enter pickup & drop, preview route on the map and choose the best provider.</p>
					</div>

					<div className="flex gap-3">
						<button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white/90 dark:bg-slate-800">
							← Back
						</button>
						<button
							onClick={() => {
								setFrom("Current location");
								setTo("Guntur");
								setResults(null);
								setChosen(null);
								// clear map layers if any
								if (markersRef.current.length) {
									markersRef.current.forEach((m) => mapRef.current && mapRef.current.removeLayer(m));
									markersRef.current = [];
								}
								if (routeLayerRef.current && mapRef.current) {
									mapRef.current.removeLayer(routeLayerRef.current);
									routeLayerRef.current = null;
								}
							}}
							className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white/90 dark:bg-slate-800"
						>
							Reset
						</button>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-6 pb-16">
				<section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					<div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/95 rounded-xl shadow-lg p-4 md:p-6">
						<div className="flex flex-col md:flex-row gap-4 md:items-center">
							<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
								<input
									value={from}
									onChange={(e) => setFrom(e.target.value)}
									className="px-4 py-3 rounded border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/30 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
									placeholder="Pickup (address or 'Current location')"
								/>
								<input
									value={to}
									onChange={(e) => setTo(e.target.value)}
									className="px-4 py-3 rounded border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/30 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
									placeholder="Dropoff (address or landmark)"
								/>
							</div>

							<div className="flex gap-3 items-center">
								<button
									onClick={runCompare}
									disabled={loading}
									className={`inline-flex items-center gap-2 px-4 py-3 rounded shadow transition ${
										loading ? "opacity-60 cursor-not-allowed bg-primary text-white" : "bg-gradient-to-r from-primary to-indigo-600 text-white"
									}`}
								>
									{loading ? "Locating…" : "Show route & Compare"}
									<ArrowRight className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div className="mt-4 rounded-lg overflow-hidden border bg-white dark:bg-slate-900">
							<div className="p-3 border-b flex items-center justify-between">
								<div className="text-sm text-muted-foreground dark:text-slate-300">Route preview</div>
								<div className="text-xs text-muted-foreground dark:text-slate-300">OpenStreetMap + OSRM (demo)</div>
							</div>

							<div id={mapContainerId} style={{ height: 420 }} className="w-full" />
							<div className="p-3 text-xs text-muted-foreground dark:text-slate-400">Tip: allow browser location for "Current location". Demo route uses public OSRM server — not for production.</div>
						</div>
					</div>

					<aside className="bg-white/80 dark:bg-slate-800/95 rounded-xl shadow-md p-6 flex flex-col gap-4">
						<div>
							<h3 className="text-lg font-semibold dark:text-slate-100">How to choose</h3>
							<ul className="mt-3 text-sm text-muted-foreground dark:text-slate-300 space-y-2">
								<li>• Cheapest — shown with a "Cheapest" badge</li>
								<li>• Fastest ETA — prefer lower ETA</li>
								<li>• Bike or comfort — read the note</li>
							</ul>
						</div>

						<div className="mt-auto">
							<button onClick={() => (results ? setResults(null) : runCompare())} className="w-full bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-3 rounded shadow">
								{results ? "Clear results" : "Quick compare"}
							</button>
						</div>
					</aside>
				</section>

				<section>
					{!results && <div className="text-center text-muted-foreground dark:text-slate-300 py-12">Enter pickup & drop and click Show route & Compare to see demo estimates and route.</div>}

					{results && (
						<>
							<div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h2 className="text-2xl font-bold dark:text-slate-100">Results</h2>
									<div className="text-sm text-muted-foreground dark:text-slate-300">Pick the best option by price, ETA or note.</div>
								</div>
								<div className="text-sm dark:text-slate-200">
									Best price: <span className="font-medium">{bestPrice ? `₹${bestPrice}` : "-"}</span>{" "}
									<span className="text-xs text-muted-foreground dark:text-slate-300">· click "Choose" to select provider</span>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{results.map((r) => {
									const isBest = bestPrice !== null && r.price === bestPrice;
									const selected = chosen === r.provider;
									return (
										<div
											key={r.provider}
											className={`relative p-5 rounded-lg shadow-md transition transform hover:-translate-y-1 ${
												isBest ? "ring-2 ring-emerald-300" : ""
											} ${selected ? "border-2 border-primary dark:border-indigo-400" : "border border-transparent"} bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100`}
										>
											{isBest && <div className="absolute -top-3 left-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded">Cheapest</div>}
											<div className="flex items-center justify-between mb-3">
												<div className="text-lg font-semibold">{r.provider}</div>
												<div className={`text-sm ${r.surge ? "text-amber-600" : "text-muted-foreground dark:text-slate-300"}`}>{r.surge ? "Surge" : "Normal"}</div>
											</div>

											<div className="mb-4">
												<div className="text-3xl font-bold">₹{r.price}</div>
												<div className="text-sm text-muted-foreground dark:text-slate-300 flex items-center gap-3 mt-1">
													<Clock className="w-4 h-4" /> ETA: {r.etaMin} min
												</div>
												<div className="text-xs text-muted-foreground dark:text-slate-300 mt-2">{r.note}</div>
											</div>

											<div className="flex gap-3">
												<button
													onClick={() => setChosen(r.provider)}
													className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded transition ${
														selected ? "bg-primary text-white dark:bg-indigo-600" : "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-slate-700 dark:text-slate-100"
													}`}
												>
													{selected ? "Selected" : "Choose"}
												</button>

												<a
													href="#"
													onClick={(e) => {
														e.preventDefault();
														alert(`${r.provider} app would open (demo).`);
													}}
													className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white dark:bg-slate-700 dark:border-slate-700"
												>
													Open App
												</a>
											</div>
										</div>
									);
								})}
							</div>

							<div className="mt-8 bg-white/80 dark:bg-slate-800/95 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<div className="text-sm text-muted-foreground dark:text-slate-300">Selected ride</div>
									<div className="text-lg font-semibold dark:text-slate-100">{chosen ?? "None selected"}</div>
								</div>

								<div className="flex gap-3">
									<button
										onClick={() => {
											if (!chosen) {
												alert("Please choose a provider first.");
												return;
											}
											alert(`Proceeding with ${chosen} — demo only.`);
										}}
										className="bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-3 rounded shadow"
									>
										Confirm & Book
									</button>

									<a href="/" className="px-4 py-3 rounded border bg-white dark:bg-slate-700">
										Back to home
									</a>
								</div>
							</div>
						</>
					)}
				</section>

				<section className="mt-10 text-xs text-muted-foreground dark:text-slate-400">
					Demo fares — integrate official provider APIs to get live quotes. Do not store API keys in the browser.
				</section>
			</main>
		</div>
	);
}