


import React, { useState, useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Page } from '../types';
import { SearchIcon, HeartIcon, ChatIcon, UserCircleIcon, CompassIcon } from './icons';

const navItemsConfig = [
    { id: 'listings', label: 'Explore', icon: CompassIcon, page: 'listings' as Page },
    { id: 'search', label: 'Search', icon: SearchIcon, page: 'search' as Page },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon, page: 'dashboard' as Page },
    { id: 'messages', label: 'Messages', icon: ChatIcon, page: 'messages' as Page },
    { id: 'profile', label: 'Profile', icon: UserCircleIcon, page: 'dashboard' as Page }
];

export const BottomNavbar: React.FC<{
    session: Session | null;
    currentPage: Page | 'login';
    onNavigate: (page: Page) => void;
}> = ({ session, currentPage, onNavigate }) => {
    const [activeTabId, setActiveTabId] = useState('listings');
    const [pillStyle, setPillStyle] = useState({});
    
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentTabId = activeTabId;
        if (currentPage === 'login') {
            currentTabId = 'profile';
        } else if (currentPage === 'listings' || currentPage === 'search' || currentPage === 'dashboard' || currentPage === 'messages') {
             // Heuristic: If we navigated to dashboard, and the active tab isn't one of the dashboard tabs,
             // default to 'wishlist'. This helps sync state if navigation happens externally.
            if (currentPage === 'dashboard' && activeTabId !== 'wishlist' && activeTabId !== 'profile') {
                currentTabId = 'wishlist';
            } else if (currentPage !== 'dashboard') {
                currentTabId = currentPage;
            }
        }
        setActiveTabId(currentTabId);
    }, [currentPage]);
    
    const activeIndex = navItemsConfig.findIndex(item => item.id === activeTabId);

    useEffect(() => {
        const activeItemEl = itemRefs.current[activeIndex];
        if (activeItemEl) {
            const { offsetLeft, clientWidth } = activeItemEl;
            setPillStyle({
                left: `${offsetLeft}px`,
                width: `${clientWidth}px`,
            });
        }
    }, [activeIndex]);
        
    const handleNavClick = (page: Page, id: string) => {
        setActiveTabId(id);
        onNavigate(page);
    };

    return (
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-auto z-50">
            <div ref={navRef} className="relative flex items-center justify-center rounded-full bg-white/60 backdrop-blur-xl p-2 shadow-xl ring-1 ring-black/5">
                <div 
                    className="animated-gradient-pill absolute top-1/2 -translate-y-1/2 h-10 rounded-full transition-all duration-300 ease-in-out"
                    style={pillStyle}
                />
                
                {navItemsConfig.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <button
                            key={item.id}
                            ref={el => itemRefs.current[index] = el}
                            onClick={() => handleNavClick(item.page, item.id)}
                            className="relative z-10 flex items-center justify-center h-10 px-4 rounded-full transition-colors duration-300 ease-in-out focus:outline-none"
                            aria-label={item.label}
                        >
                            <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                            {isActive && (
                                <span className="ml-2 text-sm font-semibold text-white whitespace-nowrap">
                                    {item.id === 'profile' ? (session ? 'Profile' : 'Login') : item.label}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};