import { Provider } from '../types';

const providers: Provider[] = [
    { name: "OLA", baseFare: 80, perKm: 10, surgeMultiplier: 1.5 },
    { name: "Uber", baseFare: 85, perKm: 12, surgeMultiplier: 1.4 },
    { name: "Rapido", baseFare: 60, perKm: 8, surgeMultiplier: 1.3 },
];

export const fetchProviderData = async (from: string, to: string): Promise<any> => {
    // Simulate fetching data from an API
    return new Promise((resolve) => {
        setTimeout(() => {
            const results = providers.map(provider => {
                const distance = Math.random() * 10; // Simulated distance in km
                const price = provider.baseFare + (distance * provider.perKm);
                const surge = Math.random() < 0.3; // 30% chance of surge pricing
                return {
                    provider: provider.name,
                    price: surge ? price * provider.surgeMultiplier : price,
                    etaMin: Math.round(5 + Math.random() * 10), // Simulated ETA
                    surge,
                    note: surge ? "Surge pricing in effect" : "Normal pricing",
                };
            });
            resolve(results);
        }, 500);
    });
};