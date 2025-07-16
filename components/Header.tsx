
import React from 'react';
import { PlusIcon, SearchIcon, ArrowRightIcon, ShieldCheckIcon } from './icons';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { Page, ListingType, UserProfile } from '../types';
import { Button } from './Button';

interface HeaderProps {
    session: Session | null;
    userProfile: UserProfile | null;
    onNavigate: (page: Page, listingType?: ListingType) => void;
}

export const Header: React.FC<HeaderProps> = ({ session, userProfile, onNavigate }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('listings');
  };

  const isAdmin = userProfile?.role === 'admin';
  const navButtonClasses = "bg-transparent border-none p-0 cursor-pointer text-slate-600 hover:text-violet-600 transition-colors duration-300 text-sm font-medium";

  return (
    <header className="hidden md:flex justify-center z-40 py-4">
      <div className="flex items-center gap-8 bg-white/80 backdrop-blur-lg rounded-full shadow-lg ring-1 ring-black/5 px-6 py-2">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('listings')} className="flex items-center bg-transparent border-none p-0 cursor-pointer group">
              <img src="https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams%20Logo%20black.png" alt="Dozen Dreams Logo" className="h-8 w-auto group-hover:opacity-90 transition-opacity" />
            </button>
          </div>
          
           <nav className="flex items-center space-x-6">
             <button onClick={() => onNavigate('listings', ListingType.SALE)} className={navButtonClasses}>Sale</button>
             <button onClick={() => onNavigate('listings', ListingType.RENT)} className={navButtonClasses}>Book</button>
             <button onClick={() => onNavigate('about')} className={navButtonClasses}>About Us</button>
             <button onClick={() => onNavigate('contact')} className={navButtonClasses}>Contact</button>
           </nav>

           <div className="flex items-center space-x-4">
             <button
                onClick={() => onNavigate('search')}
                className="text-slate-600 hover:text-violet-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Search"
            >
                <SearchIcon className="w-5 h-5"/>
            </button>
            <div className="h-6 w-px bg-slate-200" />
             {session ? (
                <>
                    <button onClick={() => onNavigate('dashboard')} className={`${navButtonClasses} flex items-center gap-1.5`}>
                        {isAdmin && <ShieldCheckIcon className="w-4 h-4 text-violet-500" />}
                        <span>{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-slate-200 text-slate-800 hover:bg-slate-300 transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold">
                        Logout
                    </button>
                    <Button onClick={() => onNavigate('add-listing')} className="text-sm">
                        <PlusIcon className="w-4 h-4" />
                        <span>Add Listing</span>
                    </Button>
                </>
             ) : (
                <Button onClick={() => onNavigate('login')} className="text-sm">
                    <span>Sign In</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </Button>
             )}
           </div>
        </div>
    </header>
  );
};
