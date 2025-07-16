
import React from 'react';
import { FEATURED_LOCATIONS } from '../constants';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface LocationsPageProps {
  onSelectLocation: (location: string) => void;
}

export const LocationsPage: React.FC<LocationsPageProps> = ({ onSelectLocation }) => {
  return (
    <div className="animate-fade-in pt-24">
      <div className="bg-white text-center py-20 px-4 shadow-sm border-b border-slate-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Iconic Destinations</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
          Explore our portfolio of luxury listings in the world's most sought-after locales.
        </p>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_LOCATIONS.map(location => (
            <div
              key={location.name}
              onClick={() => onSelectLocation(location.name)}
              className="relative rounded-lg overflow-hidden shadow-2xl cursor-pointer group h-96"
            >
              <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <h2 className="text-3xl font-bold">{location.name}</h2>
                <p className="mt-1 text-gray-200">{location.description}</p>
                 <div className="mt-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-2 transition-all duration-300 flex items-center text-violet-300 font-semibold">
                    <span>View Listings</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
