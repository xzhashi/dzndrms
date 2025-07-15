import React from 'react';
import type { Session } from '@supabase/supabase-js';
import { Listing } from '../types';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { AuthPage } from './AuthPage';
import { DiamondIcon } from './icons';

interface DashboardPageProps {
  session: Session | null;
  savedListings: Listing[];
  onSaveToggle: (listingId: string) => void;
  onViewDetails: (listing: Listing) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ session, savedListings, onSaveToggle, onViewDetails }) => {
  if (!session) {
    // This case should ideally be handled by the router in App.tsx, but as a fallback:
    return <AuthPage onNavigate={() => {}} />;
  }

  const { user } = session;
  const isAdmin = user.user_metadata?.role === 'admin';

  if (isAdmin) {
    return <AdminDashboard user={user} />;
  }
  
  return <UserDashboard user={user} session={session} savedListings={savedListings} onSaveToggle={onSaveToggle} onViewDetails={onViewDetails} />;
};