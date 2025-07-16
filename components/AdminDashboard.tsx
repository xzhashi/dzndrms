

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Listing } from '../types';
import { Modal } from './Modal';
import { ListingForm, ListingFormData } from './ListingForm';
import { PlusIcon } from './icons';
import type { User } from '@supabase/supabase-js';
import { Button } from './Button';
import { AdminListingCard } from './AdminListingCard';

const META_TAG = '<!--DD_META:';

interface AdminDashboardProps {
  user: User;
  categoryMaps: {
    nameToId: Record<string, number>;
    idToName: Record<number, string>;
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, categoryMaps }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const fetchListings = useCallback(async () => {
    if (Object.keys(categoryMaps.idToName).length === 0) return;
    setIsLoading(true);
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching listings for admin:', error);
      alert('Could not fetch listings.');
    } else {
      const listingsWithCategoryName = data.map(l => ({
        ...l,
        imageUrl: l.image_url,
        category: categoryMaps.idToName[l.category_id] || '',
      }));
      setListings(listingsWithCategoryName as Listing[]);
    }
    setIsLoading(false);
  }, [categoryMaps]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleAddNew = () => {
    setEditingListing(null);
    setIsModalOpen(true);
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setIsModalOpen(true);
  };

  const handleDelete = async (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const { error } = await supabase.from('listings').delete().match({ id: listingId });
      if (error) {
        alert(`Error deleting listing: ${error.message}`);
      } else {
        alert('Listing deleted successfully.');
        fetchListings();
      }
    }
  };

  const handleSave = async (formData: Omit<ListingFormData, 'lat'|'lon'> & { lat?: number; lon?: number; }) => {
    const category_id = categoryMaps.nameToId[formData.category];
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
        description: formDescription, 
        imageUrl, // Destructure to remove from core data
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
      lat: lat ?? (Math.random() * 180 - 90),
      lon: lon ?? (Math.random() * 360 - 180),
      user_id: (coreData as any).user_id || user.id, // Preserve user_id on edit, or set admin's id for new
    };
    
    delete (dataToSave as any).id;
    if(formData.id) {
        (dataToSave as any).id = formData.id;
    }

    const { error } = await supabase.from('listings').upsert(dataToSave);
    
    if (error) {
      alert(`Error saving listing: ${error.message}`);
    } else {
      alert('Listing saved successfully!');
      setIsModalOpen(false);
      fetchListings();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
          <img src="https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams%20Logo%20black.png" alt="Loading" className="h-12 w-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage all listings on the platform.</p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusIcon className="w-5 h-5" />
          <span>Add New Listing</span>
        </Button>
      </div>

        {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {listings.map((listing) => (
                    <AdminListingCard
                        key={listing.id}
                        listing={listing}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-lg border-2 border-dashed border-slate-300">
                <h3 className="text-xl font-semibold text-slate-800">No listings found.</h3>
                <p className="mt-2 text-slate-500">Create the first listing to get started.</p>
                <Button onClick={handleAddNew} className="mt-6 mx-auto">
                    <PlusIcon className="w-5 h-5" />
                    <span>Create Listing</span>
                </Button>
            </div>
        )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingListing ? 'Edit Listing' : 'Add New Listing'}>
          <ListingForm listing={editingListing} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};