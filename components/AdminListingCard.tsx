
import React from 'react';
import { Listing, ListingType } from '../types';
import { PencilIcon, TrashIcon, LocationIcon, UserCircleIcon } from './icons';
import { Button } from './Button';

interface AdminListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

export const AdminListingCard: React.FC<AdminListingCardProps> = ({ listing, onEdit, onDelete }) => {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-lg overflow-hidden group border border-white/20 shadow-lg animate-fade-in">
      <div className="relative">
        <img className="h-56 w-full object-cover" src={listing.imageUrl} alt={listing.title} />
        <div className="absolute top-0 right-0 m-3 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
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
      <div className="p-4 bg-white/80">
        <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-slate-900">
                {formatPrice(listing.price)}
            </div>
            <span className="text-sm font-medium text-slate-500 capitalize">
                For {listing.type.toLowerCase()}
            </span>
        </div>
        
        {listing.user_id && (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 border-t border-slate-200 pt-3 mt-3">
                <UserCircleIcon className="w-4 h-4" />
                <span>User ID: <span className="font-mono">{listing.user_id.substring(0, 8)}...</span></span>
            </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
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
      </div>
    </div>
  );
};
