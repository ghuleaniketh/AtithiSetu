import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import MapView from "../components/MapView";
import { FareResult } from "../types"; // Assuming FareResult is defined in types/index.ts

const mockCompare = (from: string, to: string): FareResult[] => [
	{ provider: "OLA", price: Math.round(80 + Math.random() * 120), etaMin: 4 + Math.round(Math.random() * 6), surge: Math.random() > 0.8, note: "Comfortable" },
	{ provider: "Uber", price: Math.round(85 + Math.random() * 140), etaMin: 3 + Math.round(Math.random() * 8), surge: Math.random() > 0.75, note: "Popular" },
	{ provider: "Rapido", price: Math.round(60 + Math.random() * 100), etaMin: 5 + Math.round(Math.random() * 7), surge: Math.random() > 0.85, note: "Bike option" },
];

export default function FareComparePage() {
	const navigate = useNavigate();
	const [from, setFrom] = useState("Current location");
	const [to, setTo] = useState("Guntur");
	const [results, setResults] = useState<FareResult[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [chosen, setChosen] = useState<string | null>(null);

	const runCompare = () => {
		setLoading(true);
		setChosen(null);
		setTimeout(() => {
			setResults(mockCompare(from, to));
			setLoading(false);
		}, 450);
	};

	const bestPrice = useMemo(() => {
		if (!results?.length) return null;
		return Math.min(...results.map((r) => r.price));
	}, [results]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-muted/5 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100">
			<header className="py-10">
				<div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="text-center md:text-left">
						<div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-tr from-primary/20 to-info/20 shadow-sm mb-3">
							<MapPin className="w-7 h-7 text-primary" />
						</div>
						<h1 className="text-4xl font-extrabold text-primary dark:text-indigo-300">Faring — Compare OLA · Uber · Rapido</h1>
						<p className="text-muted-foreground dark:text-slate-300 max-w-xl mt-2">Compare demo fares and ETAs and choose the best ride. Prices are estimated — integrate provider APIs for live quotes.</p>
					</div>

					<div className="flex gap-3">
						<button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white/90 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700">
							← Back
						</button>
						<button
							onClick={() => {
								setFrom("Current location");
								setTo("Guntur");
								setResults(null);
								setChosen(null);
							}}
							className="inline-flex items-center gap-2 px-4 py-2 rounded border bg-white/90 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
						>
							Reset
						</button>
					</div>
				</div>
			</header>

			<main className="container mx-auto px-6 pb-16">
				<section className="bg-white/80 dark:bg-slate-800/95 rounded-xl shadow-lg p-6 md:p-8 mb-8 transition-colors">
					<div className="flex flex-col md:flex-row gap-4 md:items-center">
						<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
							<input
								value={from}
								onChange={(e) => setFrom(e.target.value)}
								className="px-4 py-3 rounded border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/30 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400"
								placeholder="Pickup (address or landmark)"
							/>
							<input
								value={to}
								onChange={(e) => setTo(e.target.value)}
								className="px-4 py-3 rounded border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/30 focus:outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400"
								placeholder="Dropoff (address or landmark)"
							/>
						</div>

						<div className="flex gap-3 items-center">
							<button
								onClick={runCompare}
								disabled={loading}
								className={`inline-flex items-center gap-2 px-4 py-3 rounded shadow transition ${
									loading
										? "opacity-60 cursor-not-allowed bg-primary text-white"
										: "bg-gradient-to-r from-primary to-indigo-600 text-white hover:from-primary/90 hover:to-indigo-500 dark:from-indigo-600 dark:to-indigo-500"
								}`}
							>
								{loading ? "Comparing…" : "Compare Fares"}
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>
					</div>
				</section>

				<section>
					{!results && (
						<div className="text-center text-muted-foreground dark:text-slate-300 py-12">
							Enter pickup & drop and click Compare to see demo estimates.
						</div>
					)}

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

							<MapView from={from} to={to} />

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