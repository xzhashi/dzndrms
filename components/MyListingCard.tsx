

import React from 'react';
import { Listing, ListingType } from '../types';
import { PencilIcon, TrashIcon, LocationIcon, SparklesIcon } from './icons';
import { Button } from './Button';

interface MyListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
  onViewDetails: (listing: Listing) => void;
  onBoost: (listingId: string) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const MyListingCard: React.FC<MyListingCardProps> = ({ listing, onEdit, onDelete, onViewDetails, onBoost }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-lg overflow-hidden group border border-white/20 shadow-lg animate-fade-in flex flex-col">
      <div className="relative cursor-pointer" onClick={() => onViewDetails(listing)}>
        <img className="h-56 w-full object-cover" src={listing.imageUrl} alt={listing.title} />
        <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
          Active
        </div>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
             <h3 className="text-white text-lg font-bold truncate">{listing.title}</h3>
             <div className="flex items-center text-sm text-gray-200 mt-1">
                <LocationIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{listing.location}</span>
             </div>
        </div>
      </div>
      <div className="p-4 bg-white/80 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-slate-900">
                {formatPrice(listing.price)}
            </div>
            <span className="text-sm font-medium text-slate-500 capitalize">
                For {listing.type.toLowerCase()}
            </span>
        </div>
        
        <div className="flex-grow"></div>

        <div className="grid grid-cols-2 gap-2 mt-4">
            <Button
                variant="secondary"
                onClick={(e) => { e.stopPropagation(); onEdit(listing);}}
                className="w-full text-sm"
            >
                <PencilIcon className="w-4 h-4" />
                <span>Edit</span>
            </Button>
            <Button
                variant="secondary"
                onClick={(e) => { e.stopPropagation(); onDelete(listing.id);}}
                className="w-full text-sm !border-red-200 !text-red-700 hover:!bg-red-50 hover:!border-red-300"
            >
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
            </Button>
        </div>
        {listing.is_featured ? (
             <div className="mt-2 text-center text-sm font-semibold text-green-700 bg-green-100 p-2.5 rounded-lg">
                Featured!
            </div>
        ) : (
            <Button 
                onClick={(e) => {e.stopPropagation(); onBoost(listing.id)}} 
                className="w-full mt-2 text-sm !bg-amber-100 !text-amber-800 hover:!bg-amber-200 !border-amber-200"
            >
                <SparklesIcon className="w-4 h-4" />
                <span>Boost Listing</span>
            </Button>
        )}
      </div>
    </div>
  );
};