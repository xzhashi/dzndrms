

import React from 'react';
import { DiamondIcon, PlusIcon } from './icons';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { Page, ListingType } from '../types';

interface HeaderProps {
    session: Session | null;
    onNavigate: (page: Page, listingType?: ListingType) => void;
}

export const Header: React.FC<HeaderProps> = ({ session, onNavigate }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onNavigate('listings');
  };

  const navButtonClasses = "bg-transparent border-none p-0 cursor-pointer text-slate-600 hover:text-violet-600 transition-colors duration-300 text-sm font-medium";

  return (
    <header className="hidden md:flex justify-center z-40 py-4">
      <div className="flex items-center gap-8 bg-white/60 backdrop-blur-xl rounded-full shadow-xl ring-1 ring-black/5 px-6 py-2">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('listings')} className="flex items-center space-x-3 bg-transparent border-none p-0 cursor-pointer group">
              <DiamondIcon className="h-8 w-8 text-violet-600 group-hover:animate-pulse" />
            </button>
          </div>
          
           <nav className="flex items-center space-x-6">
             <button onClick={() => onNavigate('about')} className={navButtonClasses}>About Us</button>
             <button onClick={() => onNavigate('contact')} className={navButtonClasses}>Contact</button>
           </nav>

           <div className="flex items-center space-x-4">
             {session ? (
                <>
                    <button onClick={() => onNavigate('dashboard')} className={navButtonClasses}>Dashboard</button>
                    <button
                        onClick={handleLogout}
                        className="bg-slate-200 text-slate-800 hover:bg-slate-300 transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold">
                        Logout
                    </button>
                    <button
                        onClick={() => onNavigate('add-listing')}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold">
                        <PlusIcon className="w-4 h-4" />
                        Add Listing
                    </button>
                </>
             ) : (
                <button
                    onClick={() => onNavigate('login')}
                    className="bg-violet-600 text-white hover:bg-violet-700 transition-all duration-300 px-4 py-2 rounded-full text-sm font-semibold">
                    Sign In
                </button>
             )}
           </div>
        </div>
    </header>
  );
};