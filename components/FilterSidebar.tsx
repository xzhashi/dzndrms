import React, { useState, useEffect } from 'react';
import { FiltersState, GeocodeResponse, LocationSuggestion } from '../types';
import { CrosshairIcon, ArrowRightIcon } from './icons';
import { Button } from './Button';
import { searchLocations } from '../services/locationService';

interface FilterSidebarProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onClose: () => void;
  userLocation: GeocodeResponse | null;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const bedroomOptions = [
    { label: 'Any', value: undefined },
    { label: '1+', value: 1 },
    { label: '2+', value: 2 },
    { label: '3+', value: 3 },
    { label: '4+', value: 4 },
    { label: '5+', value: 5 },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, onClose, userLocation }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const debouncedLocation = useDebounce(localFilters.location, 300);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  useEffect(() => {
    if (debouncedLocation) {
        searchLocations(debouncedLocation).then(setSuggestions);
    } else {
        setSuggestions([]);
    }
  }, [debouncedLocation]);

  const handleUseMyLocation = () => {
    if (userLocation) {
        const locationString = `${userLocation.city}, ${userLocation.state}`;
        setLocalFilters(prev => ({ ...prev, location: locationString }));
    }
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setLocalFilters(prev => ({...prev, priceRange: [0, value]}));
  };
  
  const handleBedroomSelect = (value?: number) => {
    setLocalFilters(prev => ({ ...prev, bedrooms: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({...prev, location: e.target.value}));
  };
  
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setLocalFilters(prev => ({...prev, location: suggestion.display_name}));
    setSuggestions([]);
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    setLocalFilters({
      listingType: localFilters.listingType,
      categories: [],
      priceRange: [0, 50000000],
      location: '',
      bedrooms: undefined,
    });
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  }

  return (
    <div className="space-y-8">
      {/* Location */}
      <div className="relative">
        <h4 className="text-md font-medium text-slate-700 mb-3">Location</h4>
        <input
            type="text"
            value={localFilters.location}
            onChange={handleLocationChange}
            placeholder="e.g. Beverly Hills, Monaco..."
            className="w-full bg-slate-100 border border-slate-300 rounded-md p-3 text-sm text-slate-800 focus:ring-violet-500 focus:border-violet-500 transition"
            autoComplete="off"
        />
        {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map(s => (
                    <button 
                        key={s.place_id} 
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-violet-50"
                    >
                        {s.display_name}
                    </button>
                ))}
            </div>
        )}
        {userLocation && (
            <button 
                type="button" 
                onClick={handleUseMyLocation}
                className="w-full mt-3 text-sm font-semibold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 px-3 py-2.5 rounded-md hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
                <CrosshairIcon className="w-4 h-4" />
                Use My Current Location
            </button>
        )}
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-md font-medium text-slate-700 mb-3">Max Price</h4>
        <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
            <span>₹0</span>
            <span className="font-semibold text-slate-800 bg-slate-200 px-2 py-1 rounded-md">{formatPrice(localFilters.priceRange[1])}</span>
        </div>
        <input
            type="range"
            min="0"
            max="50000000"
            step="100000"
            value={localFilters.priceRange[1]}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gradient-to-r from-violet-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Bedrooms */}
      <div>
        <h4 className="text-md font-medium text-slate-700 mb-3">Bedrooms</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {bedroomOptions.map(opt => (
                <button
                    key={opt.label}
                    onClick={() => handleBedroomSelect(opt.value)}
                    className={`px-4 py-3 text-sm font-semibold rounded-md transition-all ${localFilters.bedrooms === opt.value ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
      </div>
      
      {/* Footer with actions */}
      <div className="flex justify-between items-center pt-6 mt-4 border-t border-slate-200">
        <button onClick={handleClearFilters} className="text-sm font-semibold text-slate-600 hover:text-slate-900 underline transition-colors">
            Clear all
        </button>
        <Button onClick={handleApplyFilters}>
            <span>Show results</span>
            <ArrowRightIcon className="w-5 h-5"/>
        </Button>
      </div>

    </div>
  );
};