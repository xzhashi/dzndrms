

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterSidebar } from './components/FilterSidebar';
import { ListingGrid } from './components/ListingGrid';
import { Footer } from './components/Footer';
import { Listing, FiltersState, ListingType, Page, SavedListing, ListingCategory, GeocodeResponse } from './types';
import { supabase } from './services/supabaseClient';
import { ListingDetail } from './components/ListingDetail';
import { MapView } from './components/MapView';
import { GridViewIcon, MapViewIcon, DiamondIcon, FilterIcon } from './components/icons';
import type { Session } from '@supabase/supabase-js';
import { AuthPage } from './components/AuthPage';
import { LocationsPage } from './components/LocationsPage';
import { BottomNavbar } from './components/BottomNavbar';
import { CategoryScroller } from './components/CategoryScroller';
import { MessagesPage } from './components/MessagesPage';
import { SALE_CATEGORIES, BOOK_CATEGORIES } from './constants';
import { Modal } from './components/Modal';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';
import { reverseGeocodeWithGemini } from './services/geminiService';
import { SearchPage } from './components/SearchPage';
import { DashboardPage } from './components/DashboardPage';
import { AddListingPage } from './components/AddListingPage';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState<Page | 'login'>('listings');
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [fullSavedListings, setFullSavedListings] = useState<Listing[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<GeocodeResponse | null>(null);
  
  const [filters, setFilters] = useState<FiltersState>({
    listingType: ListingType.SALE,
    categories: [],
    priceRange: [0, 50000000],
    location: '',
    bedrooms: undefined,
  });

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const location = await reverseGeocodeWithGemini(latitude, longitude);
                    setUserLocation(location);
                } catch (error) {
                    console.error("Failed to reverse-geocode user's location.", error);
                }
            },
            (error) => {
                console.warn(`Geolocation error: ${error.message}`);
            }
        );
    }
  }, []);

  const fetchSavedListings = useCallback(async (userId: string | undefined) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('saved_listings')
        .select('listing_id')
        .eq('user_id', userId);
      
      if (error) throw error;
      setSavedListings(data || []);

      if (data && data.length > 0) {
        const listingIds = data.map(l => l.listing_id);
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .in('id', listingIds);
        
        if (listingError) throw listingError;
        setFullSavedListings(listingData as Listing[] || []);
      } else {
        setFullSavedListings([]);
      }

    } catch(error: any) {
      console.error('Error fetching saved listings:', error.message || error);
    }
  }, []);

  useEffect(() => {
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchSavedListings(session?.user.id);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // If user logs in successfully, navigate away from login page to the listings
        if (currentPage === 'login') {
            setCurrentPage('listings');
        }
        fetchSavedListings(session.user.id);
      } else {
        // If user logs out and is on a protected page, navigate to listings
        if(currentPage === 'dashboard' || currentPage === 'messages' || currentPage === 'add-listing') {
          setCurrentPage('listings');
        }
        setSavedListings([]);
        setFullSavedListings([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchSavedListings, currentPage]);


  const fetchListings = useCallback(async () => {
    if (selectedListing) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('type', filters.listingType)
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
      
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      if (filters.location.trim() !== '') {
        query = query.ilike('location', `%${filters.location.trim()}%`);
      }

      if (filters.bedrooms && filters.bedrooms > 0) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      
      const { data, error } = await (query as any).order('id', { ascending: true });

      if (error) {
        console.error('Error fetching listings:', error.message || error);
        throw error;
      }
      
      setListings((data as Listing[]) || []);

    } catch (error: any) {
      console.error('Failed to fetch listings:', error.message || error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedListing]);

  useEffect(() => {
    if (currentPage === 'listings') {
      fetchListings();
    }
  }, [fetchListings, currentPage]);
  
  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    window.scrollTo(0, 0);
  };
  
  const handleGoBack = () => {
    setSelectedListing(null);
  };

  const handleNavigate = (page: Page | 'login') => {
    if ((page === 'dashboard' || page === 'messages' || page === 'add-listing') && !session) {
      setCurrentPage('login');
      return;
    }
    
    setCurrentPage(page);
    if (page === 'listings') {
        setFilters(prev => ({ ...prev, categories: [] }));
    }
    setSelectedListing(null);
    window.scrollTo(0, 0);
  };
  
  const handleCategorySelect = (category: ListingCategory) => {
    setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(category) ? [] : [category]
    }));
  };

  const handleSelectLocation = (locationName: string) => {
    setFilters(prev => ({...prev, location: locationName, categories: []}));
    handleNavigate('listings');
  };

  const handleSaveToggle = async (listingId: string) => {
    if (!session) return;
    const userId = session.user.id;
    const isSaved = savedListings.some(l => l.listing_id === listingId);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_listings')
          .delete()
          .match({ user_id: userId, listing_id: listingId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_listings')
          .insert({ user_id: userId, listing_id: listingId });
        if (error) throw error;
      }
      fetchSavedListings(userId); // Refresh saved listings
    } catch (error) {
      console.error('Error toggling saved listing:', error);
    }
  };

  const renderContent = () => {
    if (currentPage === 'login') {
        return <AuthPage onNavigate={handleNavigate}/>;
    }
    
    const savedListingIds = savedListings.map(l => l.listing_id);

    switch(currentPage) {
        case 'listings':
            const categoryMaps = {
                [ListingType.SALE]: SALE_CATEGORIES,
                [ListingType.RENT]: BOOK_CATEGORIES
            };
            const selectedCategoryLabel = filters.categories.length > 0 ?
                [...SALE_CATEGORIES, ...BOOK_CATEGORIES].find(c => c.id === filters.categories[0])?.label :
                'All Listings';

            return (
               <>
                {selectedListing ? (
                  <ListingDetail listing={selectedListing} onBack={handleGoBack} onSaveToggle={handleSaveToggle} isSaved={savedListingIds.includes(selectedListing.id)} session={session} />
                ) : (
                  <>
                    <Hero 
                      listingType={filters.listingType}
                      setFilters={setFilters}
                    />
                    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-200">
                        <CategoryScroller
                            listingType={filters.listingType}
                            selectedCategory={filters.categories[0] || null}
                            onCategorySelect={handleCategorySelect}
                        />
                    </div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-12">
                             <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 capitalize">
                                        {selectedCategoryLabel} ({listings.length})
                                    </h2>
                                    <div className="flex items-center space-x-1 bg-slate-200 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-300 hover:text-slate-800'}`}
                                            aria-label="Grid View"
                                        >
                                            <GridViewIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('map')}
                                            className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === 'map' ? 'bg-violet-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-300 hover:text-slate-800'}`}
                                            aria-label="Map View"
                                        >
                                            <MapViewIcon className="w-5 h-5" />
                                        </button>
                                        <div className="h-6 w-px bg-slate-300 mx-1"></div>
                                        <button
                                            onClick={() => setIsFilterModalOpen(true)}
                                            className="px-3 py-1.5 rounded-md text-slate-500 hover:bg-slate-300 hover:text-slate-800 transition-colors"
                                            aria-label="Open Filters"
                                        >
                                            <FilterIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {viewMode === 'grid' ? (
                                    <ListingGrid listings={listings} isLoading={isLoading} onViewDetails={handleViewDetails} savedListingIds={savedListingIds} onSaveToggle={handleSaveToggle} session={session} />
                                ) : (
                                    <MapView listings={listings} isLoading={isLoading} onViewDetails={handleViewDetails} />
                                )}
                              </>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            );
        case 'search':
            return (
                <SearchPage 
                    session={session} 
                    savedListingIds={savedListingIds} 
                    onSaveToggle={handleSaveToggle} 
                    onViewDetails={handleViewDetails}
                    filters={filters}
                    setFilters={setFilters}
                    onOpenFilters={() => setIsFilterModalOpen(true)}
                    userLocation={userLocation}
                />
            );
        case 'locations':
          return <LocationsPage onSelectLocation={handleSelectLocation} />;
        case 'about':
            return <AboutUsPage />;
        case 'contact':
            return <ContactUsPage />;
        case 'add-listing':
            return <AddListingPage session={session} onListingCreated={() => handleNavigate('dashboard')} onCancel={() => handleNavigate('listings')} />;
        case 'dashboard':
            return <DashboardPage session={session} savedListings={fullSavedListings} onSaveToggle={handleSaveToggle} onViewDetails={handleViewDetails} />;
        case 'messages':
            if (!session) return <AuthPage onNavigate={handleNavigate}/>;
            return <MessagesPage />;
        default:
            return <div>Page not found.</div>;
    }
  }

  if (authLoading) {
    return (
        <div className="min-h-screen bg-slate-50 flex justify-center items-center">
            <DiamondIcon className="h-12 w-12 text-violet-500 animate-pulse" />
        </div>
    );
  }
  
  const showHeaderAndFooter = true; // Always show for a consistent experience, including login page

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 md:pb-0">
      {showHeaderAndFooter && <Header session={session} onNavigate={handleNavigate} />}
      <main>
        {renderContent()}
      </main>
      {showHeaderAndFooter && <Footer onNavigate={handleNavigate} />}
      <BottomNavbar session={session} onNavigate={handleNavigate} currentPage={currentPage as Page} />
      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filters & Search">
        <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setIsFilterModalOpen(false)} userLocation={userLocation} />
      </Modal>
    </div>
  );
};

export default App;
