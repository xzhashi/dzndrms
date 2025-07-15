import React from 'react';
import { Listing, CarListing, RealEstateListing, FarmListing, ListingType } from '../types';
import { ArrowLeftIcon, CarIcon, BedIcon, BathIcon, RulerIcon, AcreageIcon, LocationIcon, BookmarkIcon } from './icons';
import type { Session } from '@supabase/supabase-js';

// Re-usable helpers from ListingCard, could be moved to a utils file in a larger app
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
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

// Component for displaying the specific details based on listing type
const DetailSpecifics: React.FC<{ listing: Listing }> = ({ listing }) => {
    const detailItems: { icon: React.ReactNode; label: string; value: string | number }[] = [];

    if ('make' in listing) { // CarListing
        const car = listing as CarListing;
        if (car.make) detailItems.push({ icon: <CarIcon className="w-6 h-6 text-violet-500" />, label: 'Make', value: car.make });
        if (car.model) detailItems.push({ icon: <CarIcon className="w-6 h-6 text-violet-500" />, label: 'Model', value: car.model });
        if (car.year) detailItems.push({ icon: <CarIcon className="w-6 h-6 text-violet-500" />, label: 'Year', value: car.year });
    }
    if ('bedrooms' in listing) { // RealEstateListing
        const estate = listing as RealEstateListing;
        if (estate.bedrooms) detailItems.push({ icon: <BedIcon className="w-6 h-6 text-violet-500" />, label: 'Bedrooms', value: estate.bedrooms });
        if (estate.bathrooms) detailItems.push({ icon: <BathIcon className="w-6 h-6 text-violet-500" />, label: 'Bathrooms', value: estate.bathrooms });
        if (estate.sqft && estate.sqft > 0) detailItems.push({ icon: <RulerIcon className="w-6 h-6 text-violet-500" />, label: 'Area', value: `${estate.sqft.toLocaleString()} sqft` });
    }
    if ('acreage' in listing) { // FarmListing
        const farm = listing as FarmListing;
        if (farm.acreage && farm.acreage > 0) detailItems.push({ icon: <AcreageIcon className="w-6 h-6 text-violet-500" />, label: 'Acreage', value: `${farm.acreage.toLocaleString()} acres` });
    }

    if (detailItems.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Details</h3>
            <div className="grid grid-cols-2 gap-4">
                {detailItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{item.icon}</div>
                        <div>
                            <p className="text-sm text-slate-500">{item.label}</p>
                            <p className="text-lg font-semibold text-slate-800">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


interface ListingDetailProps {
    listing: Listing;
    onBack: () => void;
    onSaveToggle: (listingId: string) => void;
    isSaved: boolean;
    session: Session | null;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onBack, onSaveToggle, isSaved, session }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-violet-600 hover:text-violet-800 transition-colors duration-300 font-semibold"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Listings</span>
                </button>
            </div>

            <div className="relative h-[60vh] min-h-[400px] rounded-lg overflow-hidden shadow-2xl mb-12">
                <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-8 text-white">
                    <span className="bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      For {listing.type === ListingType.RENT ? 'BOOK' : 'SALE'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mt-4 drop-shadow-lg">{listing.title}</h1>
                    <div className="flex items-center text-lg text-gray-200 mt-2 drop-shadow">
                        <LocationIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{listing.location}</span>
                    </div>
                 </div>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7 xl:col-span-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Description</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>
                <aside className="lg:col-span-5 xl:col-span-4 mt-10 lg:mt-0">
                    <div className="sticky top-24 space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                            <div className="mb-4">
                                <p className="text-lg text-slate-500">Price</p>
                                <p className="text-4xl font-bold text-slate-900">
                                    {formatPrice(listing.price)}
                                    <span className="text-lg font-normal text-slate-500">{getPriceSuffix(listing)}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-full bg-violet-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-violet-700 transition-all duration-300 text-lg">
                                    Contact Agent
                                </button>
                                {session && (
                                    <button 
                                        onClick={() => onSaveToggle(listing.id)}
                                        className={`p-3 rounded-md transition-colors duration-300 ${isSaved ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                        aria-label={isSaved ? 'Unsave Listing' : 'Save Listing'}
                                    >
                                        <BookmarkIcon className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <DetailSpecifics listing={listing} />
                    </div>
                </aside>
            </div>

        </div>
    );
};