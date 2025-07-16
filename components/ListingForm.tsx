

import React, { useState, useEffect, useRef } from 'react';
import { Listing, ListingCategory, ListingType, Amenity, LocationSuggestion, UserProfile } from '../types';
import { SALE_CATEGORIES, BOOK_CATEGORIES, AMENITIES } from '../constants';
import { ImageUploader } from './ImageUploader';
import { PlusIcon, DiamondIcon } from './icons';
import { Button } from './Button';
import { searchLocations } from '../services/locationService';

export type ListingFormData = Omit<Listing, 'id' | 'imageUrl'> & { 
    id?: string; 
    imageUrl?: string;
    image_urls: string[];
    video_url: string;
    reel_url: string;
    amenities: string[];
    is_featured: boolean;
};

type InternalFormData = Omit<ListingFormData, 'price'|'bedrooms'|'bathrooms'|'sqft'|'year'|'acreage' | 'lat' | 'lon'> & {
    price: string;
    bedrooms: string;
    bathrooms: string;
    sqft: string;
    year: string;
    acreage: string;
    lat: string;
    lon: string;
};

const initialFormData: InternalFormData = {
    title: '',
    description: '',
    price: '',
    location: '',
    type: ListingType.SALE,
    category: ListingCategory.VILLA_SALE,
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    make: '',
    model: '',
    year: String(new Date().getFullYear()),
    acreage: '',
    image_urls: [],
    video_url: '',
    reel_url: '',
    amenities: [],
    is_featured: false,
    lat: '',
    lon: ''
};

const FormSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
  <div className="bg-white/40 backdrop-blur-lg rounded-xl p-8 border border-white/20 shadow-lg">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">{title}</h3>
      <div className="space-y-6">
          {children}
      </div>
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({ label, ...props}) => (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">{label}</label>
      <input {...props} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-white/70 p-3" />
    </div>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & {label: string}> = ({ label, children, ...props}) => (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">{label}</label>
      <select {...props} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-white/70 p-3">
          {children}
      </select>
    </div>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string}> = ({ label, ...props}) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">{label}</label>
        <textarea {...props} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-white/70 p-3" />
    </div>
);

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


export const ListingForm: React.FC<{
  listing?: Listing | null;
  onSave: (data: Omit<ListingFormData, 'lat'|'lon'> & { lat?: number; lon?: number; }) => Promise<void>;
  onCancel: () => void;
  userProfile: UserProfile | null;
}> = ({ listing, onSave, onCancel, userProfile }) => {
  const [formData, setFormData] = useState<InternalFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const locationInputRef = useRef<HTMLDivElement>(null);
  
  const debouncedLocation = useDebounce(formData.location, 300);
  
  useEffect(() => {
    if (debouncedLocation && isSuggestionsOpen) {
        searchLocations(debouncedLocation).then(setSuggestions);
    } else {
        setSuggestions([]);
    }
  }, [debouncedLocation, isSuggestionsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
            setIsSuggestionsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (listing) {
      const isRealEstate = 'bedrooms' in listing;
      const isCar = 'make' in listing;
      const isAcreage = 'acreage' in listing;
      
      setFormData({
          ...initialFormData,
          ...listing,
          price: String(listing.price || ''),
          bedrooms: isRealEstate ? String(listing.bedrooms || '') : '',
          bathrooms: isRealEstate ? String(listing.bathrooms || '') : '',
          sqft: isRealEstate ? String(listing.sqft || '') : '',
          make: isCar ? String(listing.make || '') : '',
          model: isCar ? String(listing.model || '') : '',
          year: isCar ? String(listing.year || '') : String(new Date().getFullYear()),
          acreage: isAcreage ? String(listing.acreage || '') : '',
          lat: String(listing.lat || ''),
          lon: String(listing.lon || ''),
          image_urls: listing.imageUrl ? [listing.imageUrl, ...((listing as any).image_urls || [])] : [],
          amenities: (listing as any).amenities || [],
          is_featured: listing.is_featured || false,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [listing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({...prev, [name]: checked }));
        return;
    }

    if (name === "type") {
        const newType = value as ListingType;
        const defaultCategory = newType === ListingType.SALE ? ListingCategory.VILLA_SALE : ListingCategory.STAY_RENTAL;
        setFormData(prev => ({...prev, type: newType, category: defaultCategory }));
    } else if (name === "location") {
        setFormData(prev => ({ ...prev, location: value, lat: '', lon: '' }));
        setIsSuggestionsOpen(true);
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setFormData(prev => ({
        ...prev,
        location: suggestion.display_name,
        lat: suggestion.lat,
        lon: suggestion.lon
    }));
    setIsSuggestionsOpen(false);
    setSuggestions([]);
  };

  const handleAmenitiesChange = (amenityId: string) => {
    setFormData(prev => {
        const newAmenities = prev.amenities.includes(amenityId)
            ? prev.amenities.filter(id => id !== amenityId)
            : [...prev.amenities, amenityId];
        return { ...prev, amenities: newAmenities };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { lat, lon, ...restOfFormData } = formData;

    const finalData = {
        ...restOfFormData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms, 10) || 0,
        bathrooms: parseInt(formData.bathrooms, 10) || 0,
        sqft: parseInt(formData.sqft, 10) || 0,
        year: parseInt(formData.year, 10) || new Date().getFullYear(),
        acreage: parseFloat(formData.acreage) || 0,
        lat: lat ? parseFloat(lat) : undefined,
        lon: lon ? parseFloat(lon) : undefined
    };

    await onSave(finalData);
    setIsSaving(false);
  };
  
  const categories = formData.type === ListingType.SALE ? SALE_CATEGORIES : BOOK_CATEGORIES;
  const isRealEstate = [
    ListingCategory.REAL_ESTATE_SALE, ListingCategory.STAY_RENTAL, ListingCategory.FARMHOUSE_RENTAL,
    ListingCategory.VILLA_SALE, ListingCategory.FLAT_SALE, ListingCategory.BUNGALOW_SALE, ListingCategory.FARM_HOUSE_SALE,
    ListingCategory.PENTHOUSE_SALE, ListingCategory.COMMERCIAL_SALE
  ].includes(formData.category as any);
  const isCar = [ListingCategory.CAR_SALE, ListingCategory.CAR_RENTAL].includes(formData.category as any);
  const isAcreage = [
      ListingCategory.FARM_SALE, ListingCategory.FARMLAND_SALE, ListingCategory.PLOT_SALE
  ].includes(formData.category as any);
  const canFeature = userProfile?.subscription_plan === 'pro' || userProfile?.subscription_plan === 'premium';


  return (
    <form onSubmit={handleSubmit} className="space-y-10">
        <FormSection title="Core Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                 <div className="md:col-span-2">
                    <Input label="Title" name="title" id="title" value={formData.title} onChange={handleChange} required />
                </div>
                 <div className="md:col-span-2 relative" ref={locationInputRef}>
                    <Input label="Location (e.g. City, State)" name="location" id="location" value={formData.location} onChange={handleChange} required autoComplete="off" />
                    {isSuggestionsOpen && suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {suggestions.map(s => (
                                <button 
                                    key={s.place_id} 
                                    type="button"
                                    onClick={() => handleSuggestionClick(s)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-violet-50"
                                >
                                    {s.display_name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    <Input label="Price (INR)" type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="any" />
                </div>

                <Select label="Listing Type" name="type" id="type" value={formData.type} onChange={handleChange}>
                    <option value={ListingType.SALE}>For Sale</option>
                    <option value={ListingType.RENT}>To Book</option>
                </Select>
                <Select label="Category" name="category" id="category" value={formData.category} onChange={handleChange}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </Select>

                <div className="md:col-span-2">
                     <TextArea label="Description" name="description" id="description" value={formData.description} onChange={handleChange} rows={5} required />
                </div>
            </div>
        </FormSection>
        
        <FormSection title="Media">
            <ImageUploader 
                initialUrls={formData.image_urls}
                onUrlsChange={(urls) => setFormData(prev => ({...prev, image_urls: urls}))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <Input label="Video URL (e.g., YouTube, Vimeo)" name="video_url" id="video_url" type="url" value={formData.video_url} onChange={handleChange} placeholder="https://youtube.com/watch?v=..."/>
                <Input label="Reel Link (e.g., Instagram)" name="reel_url" id="reel_url" type="url" value={formData.reel_url} onChange={handleChange} placeholder="https://instagram.com/reels/..."/>
            </div>
        </FormSection>

        {isRealEstate && (
            <FormSection title="Property Details">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Bedrooms" type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0"/>
                    <Input label="Bathrooms" type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" />
                    <Input label="Square Feet" type="number" name="sqft" value={formData.sqft} onChange={handleChange} min="0" />
                </div>
                <div>
                     <label className="block text-sm font-medium text-slate-700 mb-4">Amenities</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {AMENITIES.map(amenity => {
                            const isChecked = formData.amenities.includes(amenity.id);
                            return (
                                <label key={amenity.id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-violet-50/70 transition-colors ${isChecked ? 'bg-violet-100 border-violet-400 ring-2 ring-violet-300' : 'bg-white/70 border-slate-300'}`}>
                                    <input type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleAmenitiesChange(amenity.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <amenity.icon className="w-5 h-5 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-700">{amenity.label}</span>
                                </label>
                            );
                        })}
                     </div>
                </div>
            </FormSection>
        )}

        {isCar && (
            <FormSection title="Vehicle Details">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input label="Make" type="text" name="make" value={formData.make} onChange={handleChange} />
                    <Input label="Model" type="text" name="model" value={formData.model} onChange={handleChange} />
                    <Input label="Year" type="number" name="year" value={formData.year} onChange={handleChange} />
                </div>
            </FormSection>
        )}
        
        {isAcreage && (
            <FormSection title="Land Details">
                <Input label="Acreage" type="number" name="acreage" value={formData.acreage} onChange={handleChange} min="0" step="any" />
            </FormSection>
        )}

        {canFeature && (
            <FormSection title="Promotion">
                <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer hover:bg-violet-50/70 transition-colors ${formData.is_featured ? 'bg-violet-100 border-violet-400 ring-2 ring-violet-300' : 'bg-white/70 border-slate-300'}`}>
                    <input type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <DiamondIcon className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">Make this listing featured</span>
                </label>
                 <p className="text-xs text-slate-500 mt-2">Checking this will make your listing appear in the featured section on the homepage and stand out in search results.</p>
            </FormSection>
        )}

        <div className="flex justify-end gap-4 pt-4 mt-8">
            <Button type="button" onClick={onCancel} variant="secondary">
                Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
                <PlusIcon className="w-5 h-5" />
                <span>{isSaving ? 'Saving...' : 'Save Listing'}</span>
            </Button>
        </div>
    </form>
  );
};