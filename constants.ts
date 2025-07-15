import { ListingType, ListingCategory, FeaturedLocation } from './types';
import { CarIcon, MansionIcon, BarnIcon, YachtIcon, PlaneIcon, PlotIcon, VillaIcon, BungalowIcon, CommercialIcon, TourIcon, PartyIcon, HotelIcon, CinemaIcon } from './components/icons';

export const SALE_CATEGORIES = [
    { id: ListingCategory.REAL_ESTATE_SALE, label: 'Real Estate', icon: MansionIcon },
    { id: ListingCategory.VILLA_SALE, label: 'Villas', icon: VillaIcon },
    { id: ListingCategory.FLAT_SALE, label: 'Flats', icon: BungalowIcon },
    { id: ListingCategory.BUNGALOW_SALE, label: 'Bungalows', icon: BungalowIcon },
    { id: ListingCategory.PENTHOUSE_SALE, label: 'Penthouses', icon: MansionIcon },
    { id: ListingCategory.PLOT_SALE, label: 'Plots', icon: PlotIcon },
    { id: ListingCategory.FARMLAND_SALE, label: 'Farmland', icon: PlotIcon },
    { id: ListingCategory.FARM_HOUSE_SALE, label: 'Farm Houses', icon: BarnIcon },
    { id: ListingCategory.COMMERCIAL_SALE, label: 'Commercial', icon: CommercialIcon },
    { id: ListingCategory.CAR_SALE, label: 'Luxury Cars', icon: CarIcon },
    { id: ListingCategory.YACHT_SALE, label: 'Yachts', icon: YachtIcon },
    { id: ListingCategory.JET_SALE, label: 'Private Jets', icon: PlaneIcon },
];

export const BOOK_CATEGORIES = [
    { id: ListingCategory.STAY_RENTAL, label: 'Book a Stay', icon: VillaIcon },
    { id: ListingCategory.DESTINATION_BOOK, label: 'Destinations', icon: TourIcon },
    { id: ListingCategory.PARTY_PLACE_BOOK, label: 'Party Places', icon: PartyIcon },
    { id: ListingCategory.BANQUET_BOOK, label: 'Banquets', icon: HotelIcon },
    { id: ListingCategory.HOTEL_BOOK, label: 'Hotels', icon: HotelIcon },
    { id: ListingCategory.CINEMA_BOOK, label: 'Family Cinema', icon: CinemaIcon },
    { id: ListingCategory.TOUR_BOOK, label: 'Tours', icon: TourIcon },
    { id: ListingCategory.FARMHOUSE_RENTAL, label: 'Book a Farmhouse', icon: BarnIcon },
    { id: ListingCategory.CAR_RENTAL, label: 'Book a Car', icon: CarIcon },
    { id: ListingCategory.YACHT_RENTAL, label: 'Book a Yacht', icon: YachtIcon },
];

export const RENT_CATEGORIES = BOOK_CATEGORIES; // Alias for backward compatibility

export const FEATURED_LOCATIONS: FeaturedLocation[] = [
    { 
        name: 'Monaco', 
        description: 'The epitome of Riviera glamour and luxury.',
        imageUrl: 'https://images.unsplash.com/photo-1542367787-4bde29a58357?q=80&w=1974&auto=format&fit=crop' 
    },
    { 
        name: 'Beverly Hills', 
        description: 'Iconic estates and unparalleled opulence.',
        imageUrl: 'https://images.unsplash.com/photo-1596243455694-8a42f848523c?q=80&w=1974&auto=format&fit=crop' 
    },
    { 
        name: 'Aspen', 
        description: 'World-class skiing meets mountain elegance.',
        imageUrl: 'https://images.unsplash.com/photo-1574944813963-c5a45744a457?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: 'The Hamptons',
        description: 'Exclusive beachfront properties and serene escapes.',
        imageUrl: 'https://images.unsplash.com/photo-1580212290748-3a4794ed3c70?q=80&w=1964&auto=format&fit=crop'
    },
    {
        name: 'Dubai',
        description: 'Futuristic architecture and desert extravagance.',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop'
    },
    {
        name: 'Lake Como',
        description: 'Timeless villas and breathtaking alpine scenery.',
        imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop'
    }
];