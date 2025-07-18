import React from 'react';
import { Listing, CarListing, RealEstateListing, FarmListing, ListingType } from '../types';
import { CarIcon, BedIcon, BathIcon, RulerIcon, AcreageIcon, LocationIcon, BookmarkIcon, DiamondIcon } from './icons';
import type { Session } from '@supabase/supabase-js';
import { Button } from './Button';

interface ListingCardProps {
  listing: Listing;
  onViewDetails: (listing: Listing) => void;
  isSaved: boolean;
  onSaveToggle: (listingId: string) => void;
  session: Session | null;
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const getPriceSuffix = (listing: Listing) => {
    if (listing.type === ListingType.RENT) {
        if ('pricePer' in listing && listing.pricePer) {
            return ` / ${listing.pricePer}`;
        }
    }
    return '';
};


const CardDetails: React.FC<{ listing: Listing }> = ({ listing }) => {
    if ('make' in listing) { // CarListing
        const car = listing as CarListing;
        return (
            <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1.5">
                    <CarIcon className="w-4 h-4 text-slate-400" />
                    <span>{car.make}</span>
                </div>
                <span>&bull;</span>
                <span>{car.year}</span>
            </div>
        )
    }
    if ('bedrooms' in listing) { // RealEstateListing
        const estate = listing as RealEstateListing;
        return (
            <div className="flex items-center space-x-4 text-sm text-slate-600">
                 {estate.bedrooms ? <div className="flex items-center space-x-1.5">
                    <BedIcon className="w-4 h-4 text-slate-400" />
                    <span>{estate.bedrooms}</span>
                </div> : null}
                {estate.bathrooms ? <div className="flex items-center space-x-1.5">
                    <BathIcon className="w-4 h-4 text-slate-400" />
                    <span>{estate.bathrooms}</span>
                </div>: null}
                {estate.sqft && estate.sqft > 0 ? <div className="flex items-center space-x-1.5">
                    <RulerIcon className="w-4 h-4 text-slate-400" />
                    <span>{estate.sqft.toLocaleString()} sqft</span>
                </div> : null}
            </div>
        )
    }
    if ('acreage' in listing) { // FarmListing
        const farm = listing as FarmListing;
        if (!farm.acreage || farm.acreage <= 0) return null;
        return (
             <div className="flex items-center space-x-2 text-sm text-slate-600">
                <AcreageIcon className="w-4 h-4 text-slate-400" />
                <span>{farm.acreage.toLocaleString()} acres</span>
            </div>
        )
    }
    return null;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onViewDetails, isSaved, onSaveToggle, session }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onSaveToggle(listing.id);
  };
  
  return (
    <div onClick={() => onViewDetails(listing)} className="bg-white/60 backdrop-blur-md rounded-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300 border border-white/20 hover:shadow-xl cursor-pointer shadow-lg">
      <div className="relative">
        <img className="h-56 w-full object-cover" src={listing.imageUrl} alt={listing.title} />
        <div className="absolute top-3 right-3 bg-violet-100 text-violet-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
          For {listing.type === ListingType.RENT ? 'BOOK' : 'SALE'}
        </div>
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.is_featured && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-lg animate-fade-in">
                    <DiamondIcon className="w-4 h-4" />
                    <span>Featured</span>
                </div>
            )}
            {session && (
                <button 
                    onClick={handleSaveClick}
                    className={`p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-all duration-200 ${isSaved ? 'text-violet-400' : 'text-white'}`}
                    aria-label={isSaved ? 'Unsave listing' : 'Save listing'}
                >
                    <BookmarkIcon className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} />
                </button>
            )}
        </div>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
             <h3 className="text-white text-lg font-bold truncate">{listing.title}</h3>
             <div className="flex items-center text-sm text-gray-200 mt-1">
                <LocationIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{listing.location}</span>
             </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-slate-900">
                {formatPrice(listing.price)}
                <span className="text-sm font-normal text-slate-500">{getPriceSuffix(listing)}</span>
            </div>
        </div>
        <div className="h-12 flex items-center">
            <CardDetails listing={listing} />
        </div>
        <Button
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); onViewDetails(listing);}}
            className="mt-4 w-full">
            View Details
        </Button>
      </div>
    </div>
  );
};