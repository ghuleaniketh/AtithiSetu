import React from "react";
import { Provider } from "../types"; // Adjust the import based on your types definition

type ProviderCardProps = {
    provider: Provider;
    price: number;
    etaMin: number;
    surge: boolean;
    note?: string;
    onSelect: (provider: Provider) => void;
    selected: boolean;
};

const ProviderCard: React.FC<ProviderCardProps> = ({ provider, price, etaMin, surge, note, onSelect, selected }) => {
    return (
        <div
            className={`relative p-5 rounded-lg shadow-md transition transform hover:-translate-y-1 ${
                selected ? "border-2 border-primary dark:border-indigo-400" : "border border-transparent"
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100`}
        >
            {surge && <div className="absolute -top-3 left-3 bg-amber-600 text-white text-xs px-2 py-1 rounded">Surge Pricing</div>}
            <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">{provider}</div>
                <div className={`text-sm ${surge ? "text-amber-600" : "text-muted-foreground dark:text-slate-300"}`}>
                    {surge ? "Surge" : "Normal"}
                </div>
            </div>

            <div className="mb-4">
                <div className="text-3xl font-bold">₹{price}</div>
                <div className="text-sm text-muted-foreground dark:text-slate-300 flex items-center gap-3 mt-1">
                    <span>ETA: {etaMin} min</span>
                </div>
                {note && <div className="text-xs text-muted-foreground dark:text-slate-300 mt-2">{note}</div>}
            </div>

            <button
                onClick={() => onSelect(provider)}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded transition ${
                    selected ? "bg-primary text-white dark:bg-indigo-600" : "bg-primary/10 text-primary hover:bg-primary/20 dark:bg-slate-700 dark:text-slate-100"
                }`}
            >
                {selected ? "Selected" : "Choose"}
            </button>
        </div>
    );
};

export default ProviderCard;