import React from 'react';
import { ListingForm } from './ListingForm';
import { Listing } from '../types';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface AddListingPageProps {
  session: Session | null;
  onListingCreated: () => void;
  onCancel: () => void;
}

export const AddListingPage: React.FC<AddListingPageProps> = ({ session, onListingCreated, onCancel }) => {

  const handleSave = async (listingData: Omit<Listing, 'id' | 'lat' | 'lon'> & { id?: string }) => {
    if (!session) {
        alert("You must be logged in to create a listing.");
        return;
    }

    // A real app would get lat/lon from an address, here we use random values for simplicity.
    const dataToSave = {
      ...listingData,
      lat: listingData.lat || (Math.random() * 180 - 90),
      lon: listingData.lon || (Math.random() * 360 - 180),
      user_id: session.user.id
    };

    const { error } = await supabase.from('listings').upsert(dataToSave);
    
    if (error) {
      alert(`Error saving listing: ${error.message}`);
    } else {
      alert('Listing created successfully!');
      onListingCreated();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Create a New Listing</h1>
                <p className="text-slate-500 mt-1">Fill out the details below to put your item on the market.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200">
                <ListingForm listing={null} onSave={handleSave} onCancel={onCancel} />
            </div>
        </div>
    </div>
  );
};