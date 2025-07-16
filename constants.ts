
import { ListingCategory, FeaturedLocation, Amenity } from './types';
import { PoolIcon, GymIcon, WifiIcon, GarageIcon } from './components/icons';

export const SALE_CATEGORIES = [
    { id: ListingCategory.REAL_ESTATE_SALE, label: 'Real Estate', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/IMG_4070.png' },
    { id: ListingCategory.VILLA_SALE, label: 'Villas', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4016.webp' },
    { id: ListingCategory.FLAT_SALE, label: 'Flats', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4021.webp' },
    { id: ListingCategory.BUNGALOW_SALE, label: 'Bungalows', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20bungalow.webp' },
    { id: ListingCategory.PENTHOUSE_SALE, label: 'Penthouses', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20flat.webp' },
    { id: ListingCategory.PLOT_SALE, label: 'Plots', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4018.webp' },
    { id: ListingCategory.FARMLAND_SALE, label: 'Farmland', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4012.webp' },
    { id: ListingCategory.FARM_HOUSE_SALE, label: 'Farm Houses', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4014.webp' },
    { id: ListingCategory.COMMERCIAL_SALE, label: 'Commercial', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4020.webp' },
    { id: ListingCategory.CAR_SALE, label: 'Luxury Cars', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4013.webp' },
    { id: ListingCategory.YACHT_SALE, label: 'Yachts', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/IMG_4067.webp' },
    { id: ListingCategory.JET_SALE, label: 'Private Jets', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/IMG_4066.webp' },
];

export const BOOK_CATEGORIES = [
    { id: ListingCategory.STAY_RENTAL, label: 'Book a Stay', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/IMG_4049.webp' },
    { id: ListingCategory.DESTINATION_BOOK, label: 'Destinations', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20tour.webp' },
    { id: ListingCategory.PARTY_PLACE_BOOK, label: 'Party Places', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20partyplace.webp' },
    { id: ListingCategory.BANQUET_BOOK, label: 'Banquets', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4015.webp' },
    { id: ListingCategory.HOTEL_BOOK, label: 'Hotels', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/IMG_4063.webp' },
    { id: ListingCategory.CINEMA_BOOK, label: 'Family Cinema', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20cinema.webp' },
    { id: ListingCategory.TOUR_BOOK, label: 'Tours', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20tour.webp' },
    { id: ListingCategory.FARMHOUSE_RENTAL, label: 'Book a Farmhouse', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams_4014.webp' },
    { id: ListingCategory.CAR_RENTAL, label: 'Book a Car', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/Dozendreams%20car.webp' },
    { id: ListingCategory.YACHT_RENTAL, label: 'Book a Yacht', imageUrl: 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/IMG_4067.webp' },
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

export const AMENITIES: Amenity[] = [
    { id: 'pool', label: 'Swimming Pool', icon: PoolIcon },
    { id: 'gym', label: 'Gym', icon: GymIcon },
    { id: 'wifi', label: 'High-Speed WiFi', icon: WifiIcon },
    { id: 'garage', label: 'Garage', icon: GarageIcon },
];
