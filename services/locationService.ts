import { GeocodeResponse, LocationSuggestion } from '../types';

export const reverseGeocode = async (lat: number, lon: number): Promise<GeocodeResponse> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            throw new Error('Failed to fetch from Nominatim API');
        }
        const data = await response.json();
        if (data && data.address) {
            return {
                city: data.address.city || data.address.town || data.address.village || '',
                state: data.address.state || data.address.country || '',
            };
        }
        throw new Error("Invalid data from Nominatim API");
    } catch (error) {
        console.error("Error during reverse geocoding:", error);
        throw new Error("Failed to reverse geocode.");
    }
};

export const fetchLocationByIp = async (): Promise<GeocodeResponse> => {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error(`IP API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(`IP API error: ${data.reason}`);
        }
        return {
            city: data.city || '',
            state: data.region || data.country_name || '',
        };
    } catch (error) {
        console.error("Error fetching location from IP API:", error);
        throw new Error("Failed to fetch IP-based location");
    }
};

export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.trim().length < 3) {
        return [];
    }
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        if (!response.ok) {
            throw new Error('Failed to fetch from Nominatim search API');
        }
        const data: LocationSuggestion[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error during location search:", error);
        return [];
    }
};
