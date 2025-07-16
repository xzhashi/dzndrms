
import React from 'react';
import { Listing, CarListing, RealEstateListing, FarmListing, ListingType, ExtendedListingData, Amenity } from '../types';
import { ArrowLeftIcon, CarIcon, BedIcon, BathIcon, RulerIcon, AcreageIcon, LocationIcon, BookmarkIcon, PlayCircleIcon, ChatIcon, CalendarIcon } from './icons';
import { AMENITIES } from '../constants';
import type { Session } from '@supabase/supabase-js';
import { Button } from './Button';

const META_REGEX = /<!--DD_META:({.+})-->/s;

const parseExtendedData = (description: string): { mainDescription: string; extendedData: ExtendedListingData } => {
    const match = description.match(META_REGEX);
    if (match && match[1]) {
        try {
            const extendedData = JSON.parse(match[1]);
            const mainDescription = description.replace(META_REGEX, '').trim();
            return { mainDescription, extendedData };
        } catch (e) {
            console.error('Failed to parse extended listing data:', e);
        }
    }
    return { mainDescription: description, extendedData: {} };
};

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

const DetailSpecifics: React.FC<{ listing: Listing, amenities: string[] }> = ({ listing, amenities }) => {
    const detailItems: { icon: React.ReactNode; label: string; value: string | number }[] = [];

    if ('make' in listing) {
        const car = listing as CarListing;
        if (car.make) detailItems.push({ icon: <CarIcon className="w-6 h-6 text-violet-500" />, label: 'Make', value: car.make });
        if (car.model) detailItems.push({ icon: <CarIcon className="w-6 h-6 text-violet-500" />, label: 'Model', value: car.model });
        if (car.year) detailItems.push({ icon: <CarIcon className="w-6 h-6 text-violet-500" />, label: 'Year', value: car.year });
    }
    if ('bedrooms' in listing) {
        const estate = listing as RealEstateListing;
        if (estate.bedrooms) detailItems.push({ icon: <BedIcon className="w-6 h-6 text-violet-500" />, label: 'Bedrooms', value: estate.bedrooms });
        if (estate.bathrooms) detailItems.push({ icon: <BathIcon className="w-6 h-6 text-violet-500" />, label: 'Bathrooms', value: estate.bathrooms });
        if (estate.sqft && estate.sqft > 0) detailItems.push({ icon: <RulerIcon className="w-6 h-6 text-violet-500" />, label: 'Area', value: `${estate.sqft.toLocaleString()} sqft` });
    }
    if ('acreage' in listing) {
        const farm = listing as FarmListing;
        if (farm.acreage && farm.acreage > 0) detailItems.push({ icon: <AcreageIcon className="w-6 h-6 text-violet-500" />, label: 'Acreage', value: `${farm.acreage.toLocaleString()} acres` });
    }
    
    const amenityDetails = amenities
        .map(amenityId => AMENITIES.find(a => a.id === amenityId))
        .filter((a): a is Amenity => !!a);

    return (
        <div className="space-y-8">
            {detailItems.length > 0 && (
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
            )}
             {amenityDetails.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {amenityDetails.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-3">
                                <amenity.icon className="w-6 h-6 text-violet-500 flex-shrink-0" />
                                <span className="text-md font-medium text-slate-700">{amenity.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface ListingDetailProps {
    listing: Listing;
    onBack: () => void;
    onSaveToggle: (listingId: string) => void;
    isSaved: boolean;
    session: Session | null;
    onBookNow: (listing: Listing) => void;
    onContactAgent: (listing: Listing) => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onBack, onSaveToggle, isSaved, session, onBookNow, onContactAgent }) => {
    const { mainDescription, extendedData } = parseExtendedData(listing.description);
    const allImages = [listing.imageUrl, ...(extendedData.image_urls || [])].filter(Boolean);
    const [mainImage, setMainImage] = React.useState(allImages[0] || listing.imageUrl);
    const isForBook = listing.type === ListingType.RENT;

    const handlePrimaryAction = () => {
        if (isForBook) {
            onBookNow(listing);
        } else {
            onContactAgent(listing);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 animate-fade-in">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-violet-600 hover:text-violet-800 transition-colors duration-300 font-semibold"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Listings</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <div className="relative h-[60vh] min-h-[400px] rounded-lg overflow-hidden shadow-2xl">
                    <img src={mainImage} alt={listing.title} className="w-full h-full object-cover" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {allImages.slice(1, 5).map((img, i) => (
                         <div key={i} className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer" onClick={() => setMainImage(img)}>
                            <img src={img} alt={`${listing.title} alternate view ${i+1}`} className="w-full h-full object-cover" />
                         </div>
                    ))}
                </div>
            </div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-7 xl:col-span-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="bg-violet-100 text-violet-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              For {listing.type === ListingType.RENT ? 'BOOK' : 'SALE'}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-slate-900">{listing.title}</h1>
                            <div className="flex items-center text-lg text-slate-500 mt-2">
                                <LocationIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                                <span>{listing.location}</span>
                            </div>
                        </div>
                    </div>
                     <div className="mt-8 border-t border-slate-200 pt-8">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Description</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">{mainDescription}</p>
                     </div>
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
                                <Button 
                                    className="w-full text-lg"
                                    onClick={handlePrimaryAction}
                                    disabled={session?.user.id === listing.user_id}
                                >
                                    <span>{isForBook ? 'Book Now' : 'Contact Agent'}</span>
                                    {isForBook ? <CalendarIcon className="w-5 h-5" /> : <ChatIcon className="w-5 h-5" />}
                                </Button>
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
                            {(extendedData.video_url || extendedData.reel_url) && (
                                <div className="mt-4 flex gap-2">
                                    {extendedData.video_url && <a href={extendedData.video_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 font-semibold p-2 rounded-md transition-colors"><PlayCircleIcon className="w-5 h-5"/> Video</a>}
                                    {extendedData.reel_url && <a href={extendedData.reel_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 text-sm bg-slate-100 hover:bg-slate-200 font-semibold p-2 rounded-md transition-colors"><PlayCircleIcon className="w-5 h-5"/> Reel</a>}
                                </div>
                            )}
                        </div>
                        <DetailSpecifics listing={listing} amenities={extendedData.amenities || []} />
                    </div>
                </aside>
            </div>

        </div>
    );
};