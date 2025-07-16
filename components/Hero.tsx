

import React, { useState, useRef, useEffect } from 'react';
import { FiltersState, ListingType, ListingCategory, GeocodeResponse, LocationSuggestion } from '../types';
import { SALE_CATEGORIES, BOOK_CATEGORIES } from '../constants';
import { ArrowRightIcon } from './icons';
import { Button } from './Button';
import { searchLocations } from '../services/locationService';

interface HeroProps {
    listingType: ListingType;
    setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
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

export const Hero: React.FC<HeroProps> = ({ listingType, setFilters, userLocation }) => {
    const [localCategory, setLocalCategory] = useState<ListingCategory | ''>('');
    const [localLocation, setLocalLocation] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const locationInputRef = useRef<HTMLDivElement>(null);
    const debouncedLocation = useDebounce(localLocation, 300);

    useEffect(() => {
        if (debouncedLocation && isSuggestionsOpen) {
            searchLocations(debouncedLocation).then(setSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [debouncedLocation, isSuggestionsOpen]);
    
    // Effect to set initial location from props
    useEffect(() => {
        if (userLocation && userLocation.city && localLocation === '') {
            setLocalLocation(`${userLocation.city}, ${userLocation.state}`);
        }
    }, [userLocation, localLocation]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
            if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
                setIsSuggestionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleTypeChange = (type: ListingType) => {
        setFilters(prev => ({ ...prev, listingType: type, categories: [] }));
        setLocalCategory('');
    };

    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            categories: localCategory ? [localCategory] : [],
            location: localLocation,
        }));
    };

    const handleSuggestionClick = (suggestion: LocationSuggestion) => {
        setLocalLocation(suggestion.display_name);
        setSuggestions([]);
        setIsSuggestionsOpen(false);
    };
    
    const handlePopularSearch = (category: ListingCategory) => {
         setFilters(prev => ({
            ...prev,
            listingType: ListingType.SALE,
            categories: [category],
            location: '',
        }));
    }

    const saleIsActive = listingType === ListingType.SALE;
    const categories = saleIsActive ? SALE_CATEGORIES : BOOK_CATEGORIES;
    const selectedCategoryLabel = categories.find(c => c.id === localCategory)?.label || 'Select Category';

    const activeBtnClasses = "border-b-2 border-white text-white";
    const inactiveBtnClasses = "border-b-2 border-transparent text-slate-300 hover:text-white";

    return (
        <div 
            className="relative bg-cover bg-center text-white" 
            style={{ backgroundImage: "url('https://strg21.dozendreams.com/storage/v1/object/public/assetspublic//DozenDreams%20Hero.webp')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative container mx-auto text-center px-4 py-16 sm:py-32">
                <img src="https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams%20Logo%20white.png" alt="Dozen Dreams Logo" className="h-12 w-auto mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight drop-shadow-lg">
                    Your Dozen Dreams Begin Here.
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-200 drop-shadow-md font-light">
                    Discover your next masterpiece, from exclusive properties to rare supercars and unique experiences.
                </p>
                
                <div className="mt-10 max-w-4xl mx-auto">
                    <div className="bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl shadow-black/20 ring-1 ring-white/10 p-2">
                        <div className="flex px-2 pt-1">
                            <button
                                onClick={() => handleTypeChange(ListingType.SALE)}
                                className={`px-3 py-2 text-sm font-semibold transition-colors ${saleIsActive ? activeBtnClasses : inactiveBtnClasses}`}
                            >
                                Buy
                            </button>
                            <button
                                onClick={() => handleTypeChange(ListingType.RENT)}
                                className={`px-3 py-2 text-sm font-semibold transition-colors ${!saleIsActive ? activeBtnClasses : inactiveBtnClasses}`}
                            >
                                Book
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-2 p-2 items-center">
                           <div className="md:col-span-4 border-r-0 md:border-r border-white/10 pr-0 md:pr-2">
                                <div className="relative" ref={categoryDropdownRef}>
                                    <label htmlFor="property-type" className="block text-xs font-semibold text-slate-300 text-left">Category</label>
                                    <button 
                                        type="button"
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className="w-full text-left bg-transparent border-none text-sm text-white p-0 focus:ring-0 font-medium flex justify-between items-center">
                                        <span>{selectedCategoryLabel}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {isCategoryDropdownOpen && (
                                        <div className="absolute z-20 top-full mt-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in-up">
                                            <div className="py-1 max-h-60 overflow-y-auto">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setLocalCategory(cat.id);
                                                            setIsCategoryDropdownOpen(false);
                                                        }}
                                                        className="text-left w-full px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                                    >
                                                        {cat.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                           </div>
                           <div ref={locationInputRef} className="md:col-span-4 mt-4 md:mt-0 border-r-0 md:border-r border-white/10 pr-0 md:pr-2 relative">
                                <label htmlFor="location" className="block text-xs font-semibold text-slate-300 text-left">Location</label>
                                <input 
                                    type="text"
                                    id="location"
                                    value={localLocation}
                                    onChange={(e) => {setLocalLocation(e.target.value); setIsSuggestionsOpen(true);}}
                                    placeholder="e.g. Los Angeles, Dubai"
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm placeholder:text-slate-400 font-medium text-white"
                                    autoComplete="off"
                                />
                                {isSuggestionsOpen && suggestions.length > 0 && (
                                    <div className="absolute z-20 top-full mt-2 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 animate-fade-in-up">
                                        <div className="py-1 max-h-60 overflow-y-auto">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s.place_id}
                                                    type="button"
                                                    onClick={() => handleSuggestionClick(s)}
                                                    className="text-left w-full px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                                >
                                                    {s.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                           </div>
                           <div className="md:col-span-4 mt-4 md:mt-0 grid grid-cols-2 gap-2">
                               <div className="col-span-2">
                                    <Button
                                        onClick={handleSearch}
                                        className="w-full text-base"
                                    >
                                        <span>Search</span>
                                        <ArrowRightIcon className="w-5 h-5" />
                                    </Button>
                               </div>
                           </div>
                        </div>
                    </div>
                     <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
                        <span className="font-semibold text-slate-200">Popular Search:</span>
                        <button onClick={() => handlePopularSearch(ListingCategory.VILLA_SALE)} className="text-slate-300 hover:text-white bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md transition-colors">Villas</button>
                        <button onClick={() => handlePopularSearch(ListingCategory.PENTHOUSE_SALE)} className="text-slate-300 hover:text-white bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md transition-colors">Penthouses</button>
                        <button onClick={() => handlePopularSearch(ListingCategory.FLAT_SALE)} className="text-slate-300 hover:text-white bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md transition-colors">Flats</button>
                        <button onClick={() => handlePopularSearch(ListingCategory.CAR_SALE)} className="text-slate-300 hover:text-white bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md transition-colors">Luxury Cars</button>
                    </div>
                </div>
            </div>
        </div>
    );
};