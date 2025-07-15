import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Listing } from '../types';
import { Modal } from './Modal';
import { ListingForm } from './ListingForm';
import { PlusIcon, PencilIcon, TrashIcon, DiamondIcon } from './icons';
import type { User } from '@supabase/supabase-js';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching listings for admin:', error);
      alert('Could not fetch listings.');
    } else {
      setListings(data as Listing[]);
    }
    setIsLoading(false);
  }, []);

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

  const handleSave = async (listingData: Omit<Listing, 'id' | 'lat' | 'lon'> & { id?: string }) => {
    // A real app would get lat/lon from an address, here we use random values for simplicity.
    const dataToSave = {
      ...listingData,
      lat: listingData.lat || (Math.random() * 180 - 90),
      lon: listingData.lon || (Math.random() * 360 - 180),
      user_id: user.id
    };

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
          <DiamondIcon className="h-12 w-12 text-violet-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage all listings on the platform.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-violet-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-violet-700 transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Listing
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{listing.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{listing.category.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{listing.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${listing.price.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleEdit(listing)} className="text-violet-600 hover:text-violet-900 p-1" title="Edit">
                      <PencilIcon className="w-5 h-5"/>
                    </button>
                    <button onClick={() => handleDelete(listing.id)} className="text-red-600 hover:text-red-900 p-1" title="Delete">
                      <TrashIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingListing ? 'Edit Listing' : 'Add New Listing'}>
          <ListingForm listing={editingListing} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
