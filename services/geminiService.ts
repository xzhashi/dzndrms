

import { GeocodeResponse } from '../types';

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
        // Switched to a free, HTTPS-enabled IP geolocation service
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
            // Use correct fields from the new API response
            state: data.region || data.country_name || '',
        };
    } catch (error) {
        console.error("Error fetching location from IP API:", error);
        // Re-throw the error so it can be handled by the caller
        throw new Error("Failed to fetch IP-based location");
    }
};
