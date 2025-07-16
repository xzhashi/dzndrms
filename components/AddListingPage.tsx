

import React from 'react';
import { ListingForm, ListingFormData } from './ListingForm';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const META_TAG = '<!--DD_META:';

interface AddListingPageProps {
  session: Session | null;
  userProfile: UserProfile | null;
  onListingCreated: () => void;
  onCancel: () => void;
  categoryNameToIdMap: Record<string, number>;
}

export const AddListingPage: React.FC<AddListingPageProps> = ({ session, userProfile, onListingCreated, onCancel, categoryNameToIdMap }) => {

  const handleSave = async (formData: Omit<ListingFormData, 'lat'|'lon'> & { lat?: number; lon?: number; }) => {
    if (!session) {
        alert("You must be logged in to create a listing.");
        return;
    }

    const category_id = categoryNameToIdMap[formData.category];
    if (!category_id) {
        alert(`Invalid category selected: ${formData.category}`);
        return;
    }
    
    const { 
        image_urls, 
        video_url, 
        reel_url, 
        amenities, 
        category,
        is_featured,
        description: formDescription, 
        imageUrl, 
        lat,
        lon,
        ...coreData 
    } = formData;

    const extendedData = { image_urls: image_urls.slice(1), video_url, reel_url, amenities };
    const finalDescription = `${formDescription}\n${META_TAG}${JSON.stringify(extendedData)}-->`;
    
    const dataToSave = {
      ...coreData,
      category_id,
      description: finalDescription,
      image_url: image_urls?.[0] || null,
      is_featured: is_featured || false,
      lat: lat ?? (Math.random() * 180 - 90),
      lon: lon ?? (Math.random() * 360 - 180),
      user_id: session.user.id
    };

    delete (dataToSave as any).id; // Ensure we are inserting a new record

    const { error } = await supabase.from('listings').insert(dataToSave).select();
    
    if (error) {
      alert(`Error saving listing: ${error.message}`);
    } else {
      alert('Listing created successfully!');
      onListingCreated();
    }
  };

  return (
    <div className="bg-slate-100/50 pt-36 pb-12 animate-fade-in">
        <div 
            className="fixed inset-0 z-[-1] bg-cover bg-center" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1992&auto=format&fit=crop')"}}
        />
        <div className="fixed inset-0 z-[-1] bg-black/30" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">Create a New Listing</h1>
                    <p className="text-slate-200 mt-2 max-w-2xl mx-auto drop-shadow-md">Fill out the details below to put your item on the market.</p>
                </div>
                <ListingForm listing={null} onSave={handleSave} onCancel={onCancel} userProfile={userProfile} />
            </div>
        </div>
    </div>
  );
};