export type Provider = "OLA" | "Uber" | "Rapido";

export type FareResult = {
    provider: Provider;
    price: number;
    etaMin: number;
    surge: boolean;
    note?: string;
};

export type Coordinates = {
    latitude: number;
    longitude: number;
};

export type Route = {
    start: Coordinates;
    end: Coordinates;
    distance: number; // in meters
    duration: number; // in seconds
};