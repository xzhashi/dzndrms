
import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { Listing, UserProfile } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { AuthPage } from './AuthPage';

interface DashboardPageProps {
  session: Session | null;
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

export const DashboardPage: React.FC<DashboardPageProps> = ({ session, userProfile, savedListings, onSaveToggle, onViewDetails, categoryMaps, onProfileUpdate }) => {
  if (!session) {
    // This case should ideally be handled by the router in App.tsx, but as a fallback:
    return <AuthPage onNavigate={() => {}} />;
  }

  const { user } = session;
  const isAdmin = userProfile?.role === 'admin';

  if (isAdmin) {
    return <AdminDashboard user={user} categoryMaps={categoryMaps} />;
  }
  
  return <UserDashboard user={user} session={session} userProfile={userProfile} onProfileUpdate={onProfileUpdate} savedListings={savedListings} onSaveToggle={onSaveToggle} onViewDetails={onViewDetails} categoryMaps={categoryMaps} />;
};