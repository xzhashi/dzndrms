


import React, { useState, useEffect, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { Listing, UserProfile } from '../types';
import { ListingGrid } from './ListingGrid';
import { supabase } from '../services/supabaseClient';
import { Modal } from './Modal';
import { ListingForm, ListingFormData } from './ListingForm';
import { PlusIcon, SparklesIcon } from './icons';
import { SubscriptionPlans, plans as subscriptionPlanData } from './SubscriptionPlans';
import { Button } from './Button';
import { MyListingCard } from './MyListingCard';
import { ProfileSettings } from './ProfileSettings';

const META_TAG = '<!--DD_META:';

interface MyListingsTabProps {
  user: User;
  userProfile: UserProfile | null;
  onViewDetails: (l: Listing) => void;
  categoryMaps: {
    nameToId: Record<string, number>;
    idToName: Record<number, string>;
  };
  onLimitReached: () => void;
}

const MyListingsTab: React.FC<MyListingsTabProps> = ({ user, userProfile, onViewDetails, categoryMaps, onLimitReached }) => {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const fetchMyListings = useCallback(async () => {
    if (Object.keys(categoryMaps.idToName).length === 0) return;
    setIsLoading(true);
    const { data, error } = await supabase.from('listings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching user listings:', error);
    } else {
      const listingsWithCategoryName = data.map(l => ({
        ...l,
        imageUrl: l.image_url,
        category: categoryMaps.idToName[l.category_id] || '',
      }));
      setMyListings(listingsWithCategoryName as Listing[]);
    }
    setIsLoading(false);
  }, [user.id, categoryMaps]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);
  
  const currentPlan = subscriptionPlanData.find(p => p.id === (userProfile?.subscription_plan || 'basic'));
  const listingsLimit = currentPlan?.listingLimit || 3;
  const hasReachedLimit = myListings.length >= listingsLimit;

  const handleAddNew = () => {
    if (hasReachedLimit) {
        alert(`You have reached your limit of ${listingsLimit} listings for the ${currentPlan?.name} plan. Please upgrade to add more.`);
        onLimitReached();
        return;
    }
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
        fetchMyListings();
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
      user_id: user.id
    };

    delete (dataToSave as any).id;
    if(formData.id) {
        (dataToSave as any).id = formData.id;
    }

    const { error } = await supabase.from('listings').upsert(dataToSave);
    
    if (error) {
      alert(`Error saving listing: ${error.message}`);
    } else {
      setIsModalOpen(false);
      fetchMyListings();
    }
  };

  const handleBoostListing = async (listingId: string) => {
    const { error } = await supabase.from('listings').update({ is_featured: true }).eq('id', listingId);
    if (error) {
        alert('Error boosting listing: ' + error.message);
    } else {
        alert('Listing boosted successfully!');
        fetchMyListings();
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center p-16">
            <img src="https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams%20Logo%20black.png" alt="Loading" className="h-10 w-auto animate-pulse" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">My Listings ({myListings.length} / {listingsLimit === Infinity ? 'Unlimited' : listingsLimit})</h2>
        <Button onClick={handleAddNew} className="text-sm" disabled={hasReachedLimit}>
          <PlusIcon className="w-4 h-4" />
          <span>Add New Listing</span>
        </Button>
      </div>

      {hasReachedLimit && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-lg" role="alert">
          <p className="font-bold">Listing Limit Reached</p>
          <p>You've reached the maximum number of listings for your plan. Please upgrade to add more.</p>
        </div>
      )}

      {myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {myListings.map((listing) => (
                  <MyListingCard
                      key={listing.id}
                      listing={listing}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewDetails={onViewDetails}
                      onBoost={handleBoostListing}
                  />
              ))}
          </div>
      ) : (
          <div className="text-center py-16 px-6 bg-white/60 backdrop-blur-md rounded-lg border-2 border-dashed border-slate-300">
              <h3 className="text-xl font-semibold text-slate-800">You haven't created any listings yet.</h3>
              <p className="mt-2 text-slate-500">Get started by creating your first listing.</p>
              <Button onClick={handleAddNew} className="mt-6 mx-auto">
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Your First Listing</span>
              </Button>
          </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingListing ? 'Edit Listing' : 'Add New Listing'}>
        <ListingForm listing={editingListing} onSave={handleSave} onCancel={() => setIsModalOpen(false)} userProfile={userProfile} />
    </Modal>
    </div>
  );
}

interface UserDashboardProps {
  user: User;
  session: Session;
  userProfile: UserProfile | null;
  savedListings: Listing[];
  onSaveToggle: (listingId: string) => void;
  onViewDetails: (listing: Listing) => void;
  categoryMaps: {
    nameToId: Record<string, number>;
    idToName: Record<number, string>;
  };
  onProfileUpdate: (userId: string) => void;
}


export const UserDashboard: React.FC<UserDashboardProps> = ({ user, session, userProfile, savedListings, onSaveToggle, onViewDetails, categoryMaps, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('my-listings');
  const savedListingIds = savedListings.map(l => l.id);

  const tabs = [
    { id: 'my-listings', label: 'My Listings' },
    { id: 'saved', label: 'Saved Listings' },
    { id: 'profile', label: 'My Profile' },
    { id: 'subscription', label: 'My Subscription' },
  ];
  
  const handleUpgradePlan = async (planId: 'basic' | 'pro' | 'premium') => {
      // Here you would typically integrate with a payment provider like Stripe.
      // For this example, we'll just update the user's profile directly.
      const { error } = await supabase
          .from('profiles')
          .update({ subscription_plan: planId })
          .eq('id', user.id);
      
      if (error) {
          alert('Failed to upgrade plan: ' + error.message);
      } else {
          alert(`Successfully upgraded to the ${planId} plan!`);
          onProfileUpdate(user.id); // Re-fetch profile data
      }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, <span className="font-medium text-slate-700">{userProfile?.fullName || user.email}</span></p>
      </div>

      <div className="border-b border-slate-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-violet-500 text-violet-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'my-listings' && <MyListingsTab user={user} userProfile={userProfile} onViewDetails={onViewDetails} categoryMaps={categoryMaps} onLimitReached={() => setActiveTab('subscription')} />}
        {activeTab === 'saved' && (
            savedListings.length > 0 ? (
                <ListingGrid 
                    listings={savedListings} 
                    isLoading={false} 
                    onViewDetails={onViewDetails}
                    savedListingIds={savedListingIds}
                    onSaveToggle={onSaveToggle}
                    session={session}
                />
            ) : (
                <div className="text-center py-16 px-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-800">You have no saved listings.</h3>
                    <p className="mt-2 text-slate-500">Browse our collection and click the bookmark icon to save your favorites.</p>
                </div>
            )
        )}
        {activeTab === 'profile' && <ProfileSettings userProfile={userProfile} onProfileUpdate={onProfileUpdate} />}
        {activeTab === 'subscription' && <SubscriptionPlans currentPlanId={userProfile?.subscription_plan || 'basic'} onUpgrade={handleUpgradePlan} />}
      </div>
    </div>
  );
};