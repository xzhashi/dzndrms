import React, { useState, useEffect } from 'react';
import { Listing, ListingCategory, ListingType, RealEstateListing, CarListing, FarmListing, PlotListing } from '../types';
import { SALE_CATEGORIES, BOOK_CATEGORIES } from '../constants';

type FormData = Omit<Listing, 'id' | 'lat' | 'lon'> & { id?: string };

interface ListingFormProps {
  listing?: Listing | null;
  onSave: (listing: FormData) => Promise<void>;
  onCancel: () => void;
}

const initialFormData: FormData = {
    title: '',
    description: '',
    price: 0,
    location: '',
    imageUrl: '',
    type: ListingType.SALE,
    category: ListingCategory.REAL_ESTATE_SALE,
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    make: '',
    model: '',
    year: new Date().getFullYear(),
    acreage: 0,
};


export const ListingForm: React.FC<ListingFormProps> = ({ listing, onSave, onCancel }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({ ...initialFormData, ...listing });
    } else {
      setFormData(initialFormData);
    }
  }, [listing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number = value;
    if (type === 'number') {
        finalValue = value ? parseFloat(value) : 0;
    }
    if (name === "type") {
        const newType = value as ListingType;
        const defaultCategory = newType === ListingType.SALE ? ListingCategory.REAL_ESTATE_SALE : ListingCategory.STAY_RENTAL;
        setFormData(prev => ({...prev, type: newType, category: defaultCategory, [name]: finalValue}));
    } else {
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
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


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (USD)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700">Listing Type</label>
                <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm">
                    <option value={ListingType.SALE}>For Sale</option>
                    <option value={ListingType.RENT}>To Book</option>
                </select>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
                <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location (e.g. City, State)</label>
                <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label>
                <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
            </div>
        </div>
        
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
        </div>

        {/* Conditional Fields */}
        {isRealEstate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-slate-200 rounded-md">
                <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700">Bedrooms</label>
                    <input type="number" name="bedrooms" id="bedrooms" value={(formData as RealEstateListing).bedrooms || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700">Bathrooms</label>
                    <input type="number" name="bathrooms" id="bathrooms" value={(formData as RealEstateListing).bathrooms || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="sqft" className="block text-sm font-medium text-slate-700">Square Feet</label>
                    <input type="number" name="sqft" id="sqft" value={(formData as RealEstateListing).sqft || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                </div>
            </div>
        )}

        {isCar && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-slate-200 rounded-md">
                <div>
                    <label htmlFor="make" className="block text-sm font-medium text-slate-700">Make</label>
                    <input type="text" name="make" id="make" value={(formData as CarListing).make || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-slate-700">Model</label>
                    <input type="text" name="model" id="model" value={(formData as CarListing).model || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-slate-700">Year</label>
                    <input type="number" name="year" id="year" value={(formData as CarListing).year || 2024} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                </div>
            </div>
        )}
        
        {isAcreage && (
             <div className="p-4 border border-slate-200 rounded-md">
                <label htmlFor="acreage" className="block text-sm font-medium text-slate-700">Acreage</label>
                <input type="number" name="acreage" id="acreage" value={(formData as (FarmListing | PlotListing)).acreage || 0} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
            </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold py-2 px-4 rounded-md transition-all">
                Cancel
            </button>
            <button type="submit" disabled={isSaving} className="bg-violet-600 text-white hover:bg-violet-700 font-semibold py-2 px-4 rounded-md transition-all disabled:bg-slate-400">
                {isSaving ? 'Saving...' : 'Save Listing'}
            </button>
        </div>
    </form>
  );
};