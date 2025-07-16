export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum ListingCategory {
  // Sale
  CAR_SALE = 'CAR_SALE',
  REAL_ESTATE_SALE = 'REAL_ESTATE_SALE',
  FARM_SALE = 'FARM_SALE',
  PENTHOUSE_SALE = 'PENTHOUSE_SALE',
  YACHT_SALE = 'YACHT_SALE',
  JET_SALE = 'JET_SALE',
  PLOT_SALE = 'PLOT_SALE',
  VILLA_SALE = 'VILLA_SALE',
  FLAT_SALE = 'FLAT_SALE',
  BUNGALOW_SALE = 'BUNGALOW_SALE',
  FARM_HOUSE_SALE = 'FARM_HOUSE_SALE',
  FARMLAND_SALE = 'FARMLAND_SALE',
  COMMERCIAL_SALE = 'COMMERCIAL_SALE',

  // Rent / Book
  CAR_RENTAL = 'CAR_RENTAL',
  FARMHOUSE_RENTAL = 'FARMHOUSE_RENTAL',
  STAY_RENTAL = 'STAY_RENTAL',
  YACHT_RENTAL = 'YACHT_RENTAL',
  DESTINATION_BOOK = 'DESTINATION_BOOK',
  PARTY_PLACE_BOOK = 'PARTY_PLACE_BOOK',
  BANQUET_BOOK = 'BANQUET_BOOK',
  HOTEL_BOOK = 'HOTEL_BOOK',
  CINEMA_BOOK = 'CINEMA_BOOK',
  TOUR_BOOK = 'TOUR_BOOK',
}

export interface Amenity {
    id: 'pool' | 'gym' | 'wifi' | 'garage';
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface BaseListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  type: ListingType;
  category: ListingCategory;
  lat: number;
  lon: number;
  user_id?: string;
  is_featured?: boolean;
}

export interface CarListing extends BaseListing {
  category: ListingCategory.CAR_SALE | ListingCategory.CAR_RENTAL;
  make: string;
  model: string;
  year: number;
  pricePer?: 'day' | 'week';
}

export interface RealEstateListing extends BaseListing {
  category: ListingCategory.REAL_ESTATE_SALE | ListingCategory.FARMHOUSE_RENTAL | ListingCategory.STAY_RENTAL | ListingCategory.PENTHOUSE_SALE | ListingCategory.VILLA_SALE | ListingCategory.FLAT_SALE | ListingCategory.BUNGALOW_SALE | ListingCategory.FARM_HOUSE_SALE | ListingCategory.COMMERCIAL_SALE | ListingCategory.DESTINATION_BOOK | ListingCategory.PARTY_PLACE_BOOK | ListingCategory.BANQUET_BOOK | ListingCategory.HOTEL_BOOK | ListingCategory.CINEMA_BOOK | ListingCategory.TOUR_BOOK;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  pricePer?: 'night' | 'week' | 'month';
}

export interface FarmListing extends BaseListing {
  category: ListingCategory.FARM_SALE | ListingCategory.FARMLAND_SALE;
  acreage: number;
}

export interface YachtListing extends BaseListing {
  category: ListingCategory.YACHT_SALE | ListingCategory.YACHT_RENTAL;
}

export interface JetListing extends BaseListing {
  category: ListingCategory.JET_SALE;
}

export interface PlotListing extends BaseListing {
    category: ListingCategory.PLOT_SALE;
    acreage: number;
}


export type Listing = CarListing | RealEstateListing | FarmListing | YachtListing | JetListing | PlotListing;

export interface FiltersState {
    listingType: ListingType;
    categories: ListingCategory[];
    priceRange: [number, number];
    location: string;
    bedrooms?: number;
}

export interface FeaturedLocation {
    name: string;
    description: string;
    imageUrl: string;
}

export type Page = 'listings' | 'locations' | 'dashboard' | 'messages' | 'about' | 'contact' | 'search' | 'add-listing';

export interface UserProfile {
    id: string;
    fullName: string;
    role: 'user' | 'agent' | 'admin';
    subscription_plan?: 'basic' | 'pro' | 'premium';
    interests?: ListingCategory[];
    budget?: number;
}

export interface SavedListing {
    user_id: string;
    listing_id: string;
    created_at: string;
}

export interface GeocodeResponse {
    city: string;
    state: string; // Could be state, province, or country
}

// For storing extra data in the description field
export interface ExtendedListingData {
  image_urls?: string[];
  video_url?: string;
  reel_url?: string;
  amenities?: string[];
}

export interface BookingData {
  listingId: string;
  listingTitle: string;
  fullName: string;
  email: string;
  guests: number;
  checkIn: Date;
  checkOut: Date;
}

export interface LocationSuggestion {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: [string, string, string, string];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
      fullName: string;
  }
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  listings: {
      title: string;
      image_url: string;
  };
  profiles: { // The "other" user's profile
      full_name: string;
  }
  // Manually added data
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}