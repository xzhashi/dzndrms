
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Listing, ListingType, FiltersState, GeocodeResponse, ListingCategory } from '../types';
import { ListingGrid } from './ListingGrid';
import { SearchIcon, FilterIcon } from './icons';
import type { Session } from '@supabase/supabase-js';
import { SALE_CATEGORIES, RENT_CATEGORIES } from '../constants';

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

interface SearchPageProps {
  session: Session | null;
  savedListingIds: string[];
  onSaveToggle: (listingId: string) => void;
  onViewDetails: (listing: Listing) => void;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onOpenFilters: () => void;
  userLocation: GeocodeResponse | null;
  categoryMaps: {
    nameToId: Record<string, number>;
    idToName: Record<number, string>;
  };
}

export const SearchPage: React.FC<SearchPageProps> = ({ 
    session, savedListingIds, onSaveToggle, onViewDetails,
    filters, setFilters, onOpenFilters, userLocation, categoryMaps
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const performSearch = useCallback(async () => {
        if (Object.keys(categoryMaps.nameToId).length === 0) {
            setIsLoading(false);
            return;
        };
        setIsLoading(true);

        const effectiveLocation = filters.location || (userLocation ? `${userLocation.city}, ${userLocation.state}` : '');
        
        try {
            let query = supabase
                .from('listings')
                .select('*')
                .eq('type', filters.listingType)
                .gte('price', filters.priceRange[0])
                .lte('price', filters.priceRange[1]);
            
            if (filters.categories.length > 0) {
                 const categoryIds = filters.categories.map(name => categoryMaps.nameToId[name]).filter(Boolean);
                if (categoryIds.length > 0) {
                    query = query.in('category_id', categoryIds);
                }
            }
    
            if (effectiveLocation.trim() !== '') {
                query = query.ilike('location', `%${effectiveLocation.trim()}%`);
            }
    
            if (filters.bedrooms && filters.bedrooms > 0) {
                query = query.gte('bedrooms', filters.bedrooms);
            }

            if (debouncedSearchTerm.trim() !== '') {
                query = query.or(`title.ilike.%${debouncedSearchTerm.trim()}%,description.ilike.%${debouncedSearchTerm.trim()}%`);
            }
            
            const { data, error } = await (query as any).order('id', { ascending: true });
            
            if (error) {
                console.error("Search error:", error);
                throw error;
            }

            const listingsWithCategoryName = data.map(l => ({
                ...l,
                imageUrl: l.image_url,
                category: categoryMaps.idToName[l.category_id] || '',
            }));

            setListings((listingsWithCategoryName as Listing[]) || []);

        } catch (error) {
            console.error("Failed to perform search", error);
            setListings([]);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, filters, userLocation, categoryMaps]);

    useEffect(() => {
        // Automatically search when filters or search term changes
        performSearch();
    }, [performSearch]);

    const handleTypeChange = (type: ListingType) => {
        setFilters(prev => ({ ...prev, listingType: type, categories: [] }));
    };

    const handleCategorySelect = (category: ListingCategory) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category) ? [] : [category]
        }));
    };
    
    const saleIsActive = filters.listingType === ListingType.SALE;
    const categories = saleIsActive ? SALE_CATEGORIES : RENT_CATEGORIES;
    
    const activeBtnClasses = "bg-violet-600 text-white";
    const inactiveBtnClasses = "bg-white text-slate-700 hover:bg-slate-100";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 animate-fade-in">
            {/* Search Bar */}
            <div className="sticky top-24 z-20 mb-8 max-w-3xl mx-auto">
                <div className="flex items-center gap-2 p-1.5 bg-white/70 backdrop-blur-xl rounded-full shadow-lg border border-slate-200">
                    <div className="flex-shrink-0 flex items-center gap-1.5 w-auto">
                        <button
                            onClick={() => handleTypeChange(ListingType.SALE)}
                            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out ${saleIsActive ? activeBtnClasses : inactiveBtnClasses}`}
                        >
                            For Sale
                        </button>
                        <button
                            onClick={() => handleTypeChange(ListingType.RENT)}
                            className={`flex-1 sm:flex-none px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out ${!saleIsActive ? activeBtnClasses : inactiveBtnClasses}`}
                        >
                            Book
                        </button>
                    </div>
                    
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by keyword, e.g. 'penthouse'..."
                            className="w-full bg-transparent border-none rounded-full py-2.5 pl-12 pr-4 text-slate-800 focus:ring-0 focus:border-transparent transition"
                        />
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <button onClick={onOpenFilters} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <FilterIcon className="w-5 h-5" />
                        <span className="hidden md:inline">Filters</span>
                    </button>
                </div>
            </div>

            {/* Category Grid */}
            <div className="mb-12 max-w-4xl mx-auto">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {categories.map((cat) => {
                        const isSelected = filters.categories.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 ease-in-out border
                                    ${isSelected 
                                        ? 'bg-violet-50 border-violet-300 shadow-md text-violet-700' 
                                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm border-slate-200'
                                    }`}
                            >
                                <img src={cat.imageUrl} alt={cat.label} className="w-7 h-7 rounded-full object-cover" />
                                <span className="text-xs font-semibold text-center">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Listings */}
            <ListingGrid 
                listings={listings} 
                isLoading={isLoading} 
                onViewDetails={onViewDetails} 
                savedListingIds={savedListingIds} 
                onSaveToggle={onSaveToggle} 
                session={session} 
            />
        </div>
    );
};
