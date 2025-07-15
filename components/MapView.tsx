import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Listing, ListingType } from '../types';
import { DiamondIcon } from './icons';

interface MapViewProps {
  listings: Listing[];
  isLoading: boolean;
  onViewDetails: (listing: Listing) => void;
}

// Custom violet diamond icon for markers
const customIcon = new L.DivIcon({
  html: `<div class="p-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-violet-600 drop-shadow-lg"><path d="M12.0001 1.60669L22.3935 6.80312L12.0001 22.3935L1.60669 6.80312L12.0001 1.60669ZM12.0001 4.63384L5.41443 8.30312L12.0001 18.3663L18.5859 8.30312L12.0001 4.63384Z"></path></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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


const MapPopupContent: React.FC<{ listing: Listing; onViewDetails: (l: Listing) => void }> = ({ listing, onViewDetails }) => (
  <div className="w-64">
    <img src={listing.imageUrl} alt={listing.title} className="w-full h-32 object-cover rounded-t-lg" />
    <div className="p-3">
        <h3 className="font-bold text-slate-800 text-md truncate">{listing.title}</h3>
        <p className="text-sm text-slate-500 truncate">{listing.location}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="text-lg font-bold text-slate-900">
                {formatPrice(listing.price)}
                <span className="text-xs font-normal text-slate-500">{getPriceSuffix(listing)}</span>
            </p>
            <button
                onClick={() => onViewDetails(listing)}
                className="bg-violet-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-violet-700 transition-colors"
            >
                Details
            </button>
        </div>
    </div>
  </div>
);

// This component will recenter the map whenever the listings change
const MapBoundsUpdater: React.FC<{ listings: Listing[] }> = ({ listings }) => {
    const map = useMap();
    React.useEffect(() => {
        if (listings.length > 0) {
            const bounds = new L.LatLngBounds(listings.map(l => [l.lat, l.lon]));
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
             map.setView([39.8283, -98.5795], 4); // Default US center view
        }
    }, [listings, map]);
    return null;
}

export const MapView: React.FC<MapViewProps> = ({ listings, isLoading, onViewDetails }) => {
    if (isLoading) {
        return (
            <div className="h-[70vh] bg-slate-200 rounded-lg animate-pulse flex items-center justify-center">
                <p className="text-slate-500">Loading Map...</p>
            </div>
        );
    }
    
    return (
        <div className="h-[70vh] bg-slate-200 rounded-lg overflow-hidden shadow-lg border border-slate-200">
            <MapContainer center={[39.8283, -98.5795]} zoom={4} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapBoundsUpdater listings={listings} />
                {listings.map(listing => (
                    <Marker key={listing.id} position={[listing.lat, listing.lon]} icon={customIcon}>
                        <Popup>
                           <MapPopupContent listing={listing} onViewDetails={onViewDetails} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
