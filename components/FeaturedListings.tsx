import React from 'react';
import { Listing } from '../types';
import { ListingCard } from './ListingCard';
import type { Session } from '@supabase/supabase-js';

interface FeaturedListingsProps {
  listings: Listing[];
  onViewDetails: (listing: Listing) => void;
  savedListingIds: string[];
  onSaveToggle: (listingId: string) => void;
  session: Session | null;
}

export const FeaturedListings: React.FC<FeaturedListingsProps> = ({ listings, onViewDetails, savedListingIds, onSaveToggle, session }) => {
    if (listings.length === 0) {
        return null;
    }
    
    return (
        <div className="py-20 bg-slate-100/70">
            <div className="container mx-auto">
                <div className="px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Featured Properties & Vehicles</h2>
                    <p className="text-lg text-center text-slate-500 mb-12">Premium listings, hand-picked for you.</p>
                </div>
                <div className="flex overflow-x-auto space-x-8 pb-8 px-4 sm:px-6 lg:px-8 featured-listing-scroller">
                    {listings.map(listing => (
                        <div key={listing.id} className="flex-shrink-0 w-full sm:w-[380px]">
                            <ListingCard
                                listing={listing}
                                onViewDetails={onViewDetails}
                                isSaved={savedListingIds.includes(listing.id)}
                                onSaveToggle={onSaveToggle}
                                session={session}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
