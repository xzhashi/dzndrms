


import { GoogleGenAI, Type } from "@google/genai";
import { GeocodeResponse } from '../types';

let ai: GoogleGenAI | null = null;

// Initialize the AI client only if the API key is available.
// This prevents the application from crashing on startup if the key is not set.
if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
    console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

export const reverseGeocodeWithGemini = async (lat: number, lon: number): Promise<GeocodeResponse> => {
    if (!ai) {
        return Promise.reject(new Error("Gemini API client is not initialized."));
    }
    
    const geocodeSchema = {
        type: Type.OBJECT,
        properties: {
            city: { type: Type.STRING, description: "The city name for the given coordinates." },
            state: { type: Type.STRING, description: "The state, province, or country for the given coordinates." }
        },
        required: ['city', 'state']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the latitude ${lat} and longitude ${lon}, what is the city and state/country?`,
            config: {
                responseMimeType: "application/json",
                responseSchema: geocodeSchema,
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            throw new Error("API returned an empty response for geocoding.");
        }
        
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API for reverse geocoding:", error);
        throw new Error("Failed to reverse geocode with Gemini.");
    }
};