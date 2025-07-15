import React from 'react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';
import type { Session } from '@supabase/supabase-js';

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  onViewDetails: (listing: Listing) => void;
  savedListingIds: string[];
  onSaveToggle: (listingId: string) => void;
  session: Session | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse border border-slate-200">
        <div className="h-56 bg-slate-200"></div>
        <div className="p-6">
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
    </div>
);

export const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading, onViewDetails, savedListingIds, onSaveToggle, session }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)}
            </div>
        );
    }
    
    if(listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-96 bg-white rounded-lg border border-slate-200">
                <h2 className="text-2xl font-semibold text-slate-800">No Listings Found</h2>
                <p className="mt-2 text-slate-500">Try adjusting your filters or broadening your search.</p>
            </div>
        );
    }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {listings.map(listing => (
        <ListingCard 
            key={listing.id} 
            listing={listing} 
            onViewDetails={onViewDetails}
            isSaved={savedListingIds.includes(listing.id)}
            onSaveToggle={onSaveToggle}
            session={session}
        />
      ))}
    </div>
  );
};