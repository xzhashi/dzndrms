import React, { useState, useEffect } from 'react';
import { FiltersState, GeocodeResponse } from '../types';
import { CrosshairIcon } from './icons';

interface FilterSidebarProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onClose: () => void;
  userLocation: GeocodeResponse | null;
}

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
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

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
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }

  return (
    <div className="space-y-8">
      {/* Location */}
      <div>
        <h4 className="text-md font-medium text-slate-700 mb-3">Location</h4>
        <input
            type="text"
            value={localFilters.location}
            onChange={handleLocationChange}
            placeholder="e.g. Beverly Hills, Monaco..."
            className="w-full bg-slate-100 border border-slate-300 rounded-md p-3 text-sm text-slate-800 focus:ring-violet-500 focus:border-violet-500 transition"
        />
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
            <span>$0</span>
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
        <button onClick={handleApplyFilters} className="bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold py-3 px-6 rounded-md hover:shadow-lg hover:shadow-slate-800/30 transition-all">
            Show results
        </button>
      </div>

    </div>
  );
};