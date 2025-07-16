
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterSidebar } from './components/FilterSidebar';
import { ListingGrid } from './components/ListingGrid';
import { Footer } from './components/Footer';
import { Listing, FiltersState, ListingType, Page, SavedListing, ListingCategory, GeocodeResponse, BookingData, UserProfile } from './types';
import { supabase } from './services/supabaseClient';
import { ListingDetail } from './components/ListingDetail';
import { MapView } from './components/MapView';
import { GridViewIcon, MapViewIcon, FilterIcon } from './components/icons';
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
import { reverseGeocode, fetchLocationByIp } from './services/locationService';
import { SearchPage } from './components/SearchPage';
import { DashboardPage } from './components/DashboardPage';
import { AddListingPage } from './components/AddListingPage';
import { FolderCategorySelector } from './components/FolderCategorySelector';
import { createCalendarBooking } from './services/googleCalendarService';
import { BookingForm } from './components/BookingForm';
import { FeaturedListings } from './components/FeaturedListings';

interface CategoryMaps {
    nameToId: Record<string, number>;
    idToName: Record<number, string>;
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingListing, setBookingListing] = useState<Listing | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentPage, setCurrentPage] = useState<Page | 'login'>('listings');
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [fullSavedListings, setFullSavedListings] = useState<Listing[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<GeocodeResponse | null>(null);
  const [categoryMaps, setCategoryMaps] = useState<CategoryMaps>({ nameToId: {}, idToName: {} });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const listingsContainerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FiltersState>({
    listingType: ListingType.SALE,
    categories: [],
    priceRange: [0, 50000000],
    location: '',
    bedrooms: undefined,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
        // Fetch categories and create maps
        const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('id, name');
        if (categoriesError) {
            console.error('Failed to fetch categories', categoriesError);
        } else if (categoriesData) {
            const nameToId: Record<string, number> = {};
            const idToName: Record<number, string> = {};
            for (const category of categoriesData) {
                nameToId[category.name] = category.id;
                idToName[category.id] = category.name;
            }
            setCategoryMaps({ nameToId, idToName });
        }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
        const fetchIpLocation = async () => {
            try {
                const location = await fetchLocationByIp();
                setUserLocation(location);
            } catch (ipError) {
                console.error("Failed to fetch location by IP.", ipError);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const location = await reverseGeocode(latitude, longitude);
                        setUserLocation(location);
                    } catch (error) {
                        console.error("Failed to reverse-geocode user's location.", error);
                        await fetchIpLocation();
                    }
                },
                async (error) => {
                    console.warn(`Geolocation error: ${error.message}`);
                    await fetchIpLocation();
                }
            );
        } else {
            await fetchIpLocation();
        }
    };
    
    getLocation();
  }, []);

  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
        console.error('Error fetching user profile', error);
    } else {
        setUserProfile(data as UserProfile);
    }
  }, []);

  const fetchSavedListings = useCallback(async (userId: string | undefined) => {
    if (!userId || Object.keys(categoryMaps.idToName).length === 0) return;
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
        
        const listingsWithCategoryName = listingData.map(l => ({
            ...l,
            imageUrl: l.image_url,
            category: categoryMaps.idToName[l.category_id] || '',
        }));

        setFullSavedListings(listingsWithCategoryName as Listing[] || []);
      } else {
        setFullSavedListings([]);
      }

    } catch(error: any) {
      console.error('Error fetching saved listings:', error.message || error);
    }
  }, [categoryMaps.idToName]);

  useEffect(() => {
    setAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchSavedListings(session.user.id);
        fetchUserProfile(session.user.id);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        if (currentPage === 'login') {
            setCurrentPage('listings');
        }
        fetchSavedListings(session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        if(currentPage === 'dashboard' || currentPage === 'messages' || currentPage === 'add-listing') {
          setCurrentPage('listings');
        }
        setSavedListings([]);
        setFullSavedListings([]);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchSavedListings, fetchUserProfile, currentPage]);


  const fetchListings = useCallback(async () => {
    if (selectedListing || Object.keys(categoryMaps.nameToId).length === 0) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('type', filters.listingType)
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
      
      if (filters.categories.length > 0) {
        const categoryIds = filters.categories.map(name => categoryMaps.nameToId[name]).filter(Boolean);
        if(categoryIds.length > 0) {
            query = query.in('category_id', categoryIds);
        }
      }

      if (filters.location.trim() !== '') {
        query = query.ilike('location', `%${filters.location.trim()}%`);
      }

      if (filters.bedrooms && filters.bedrooms > 0) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      
      const { data, error } = await (query as any).order('is_featured', { ascending: false }).order('id', { ascending: true });


      if (error) {
        console.error('Error fetching listings:', error.message || error);
        throw error;
      }
      
      const listingsWithCategoryName = data.map(l => ({
            ...l,
            imageUrl: l.image_url,
            category: categoryMaps.idToName[l.category_id] || '',
      }));
      setListings((listingsWithCategoryName as Listing[]) || []);

    } catch (error: any) {
      console.error('Failed to fetch listings:', error.message || error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, selectedListing, categoryMaps]);

  const fetchFeaturedListings = useCallback(async () => {
    if (Object.keys(categoryMaps.idToName).length === 0) return;
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('is_featured', true)
            .limit(10);

        if (error) throw error;
        
        const listingsWithCategoryName = data.map(l => ({
            ...l,
            imageUrl: l.image_url,
            category: categoryMaps.idToName[l.category_id] || '',
        }));

        setFeaturedListings(listingsWithCategoryName as Listing[] || []);
    } catch (error) {
        console.error('Failed to fetch featured listings:', error);
    }
  }, [categoryMaps.idToName]);


  useEffect(() => {
    if (currentPage === 'listings' && Object.keys(categoryMaps.nameToId).length > 0) {
      fetchListings();
      fetchFeaturedListings();
    }
  }, [fetchListings, fetchFeaturedListings, currentPage, categoryMaps]);
  
  const handleViewDetails = (listing: Listing) => {
    setSelectedListing(listing);
    window.scrollTo(0, 0);
  };
  
  const handleGoBack = () => {
    setSelectedListing(null);
  };

  const handleNavigate = (page: Page | 'login', listingType?: ListingType) => {
    if ((page === 'dashboard' || page === 'messages' || page === 'add-listing') && !session) {
      setCurrentPage('login');
      return;
    }
    
    if (page === 'listings') {
      const newListingType = listingType || filters.listingType;
      setFilters(prev => ({ 
          ...prev, 
          listingType: newListingType,
          categories: []
      }));
    }
    
    setCurrentPage(page);
    setSelectedListing(null);
    window.scrollTo(0, 0);
  };
  
  const handleCategorySelect = (category: ListingCategory) => {
    const isSaleCategory = SALE_CATEGORIES.some(c => c.id === category);

    setFilters(prev => ({
        ...prev,
        listingType: isSaleCategory ? ListingType.SALE : ListingType.RENT,
        categories: prev.categories.includes(category) ? [] : [category]
    }));

    setTimeout(() => {
        listingsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleListingTypeChange = (type: ListingType) => {
    if (filters.listingType !== type) {
        setFilters(prev => ({ ...prev, listingType: type, categories: [] }));
    }
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
      fetchSavedListings(userId);
    } catch (error) {
      console.error('Error toggling saved listing:', error);
    }
  };
  
    const handleStartConversation = async (listing: Listing) => {
        if (!session || !listing.user_id || session.user.id === listing.user_id) {
            if (!session) handleNavigate('login');
            if (session?.user?.id === listing.user_id) alert("You cannot start a conversation with yourself about your own listing.");
            return;
        }

        try {
            const { data: existing, error: existingError } = await supabase
                .from('conversations')
                .select('id')
                .eq('listing_id', listing.id)
                .eq('buyer_id', session.user.id)
                .single();

            if (existingError && existingError.code !== 'PGRST116') throw existingError;

            if (existing) {
                setActiveConversationId(existing.id);
            } else {
                const { data: newConversation, error: newError } = await supabase
                    .from('conversations')
                    .insert({ listing_id: listing.id, buyer_id: session.user.id, seller_id: listing.user_id })
                    .select('id')
                    .single();
                if (newError) throw newError;
                if (newConversation) setActiveConversationId(newConversation.id);
            }
            handleNavigate('messages');
        } catch (error: any) {
            console.error("Error starting conversation:", error);
            alert(`Could not start conversation: ${error.message}`);
        }
    };


  const handleOpenBookingModal = (listing: Listing) => {
    if (!session) {
      handleNavigate('login');
      return;
    }
    setBookingListing(listing);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData: Omit<BookingData, 'listingId' | 'listingTitle'>) => {
    if (!bookingListing) return;

    const fullBookingData: BookingData = {
        ...bookingData,
        listingId: bookingListing.id,
        listingTitle: bookingListing.title
    };
    
    try {
        const result = await createCalendarBooking(fullBookingData);
        if (result.success) {
            alert(result.message);
            setIsBookingModalOpen(false);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        alert(`Booking failed: ${errorMessage}`);
    }
  };


  const renderContent = () => {
    const savedListingIds = savedListings.map(l => l.listing_id);

    switch(currentPage) {
        case 'listings':
            const selectedCategoryLabel = filters.categories.length > 0 ?
                [...SALE_CATEGORIES, ...BOOK_CATEGORIES].find(c => c.id === filters.categories[0])?.label :
                'All Listings';

            return (
               <>
                {selectedListing ? (
                  <ListingDetail 
                    listing={selectedListing} 
                    onBack={handleGoBack} 
                    onSaveToggle={handleSaveToggle} 
                    isSaved={savedListingIds.includes(selectedListing.id)} 
                    session={session} 
                    onBookNow={handleOpenBookingModal} 
                    onContactAgent={handleStartConversation}
                   />
                ) : (
                  <>
                    <Hero 
                      listingType={filters.listingType}
                      setFilters={setFilters}
                      userLocation={userLocation}
                    />

                    <FeaturedListings 
                        listings={featuredListings} 
                        onViewDetails={handleViewDetails} 
                        savedListingIds={savedListingIds}
                        onSaveToggle={handleSaveToggle}
                        session={session}
                    />
                    
                    <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md py-3 border-b border-slate-200 shadow-sm">
                        <CategoryScroller 
                            listingType={filters.listingType} 
                            selectedCategory={filters.categories[0] || null} 
                            onCategorySelect={handleCategorySelect} 
                        />
                    </div>
                    
                    <div className="hidden md:block">
                        <FolderCategorySelector 
                            activeListingType={filters.listingType}
                            onListingTypeChange={handleListingTypeChange}
                            onCategorySelect={handleCategorySelect}
                        />
                    </div>
                    
                    <div ref={listingsContainerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    categoryMaps={categoryMaps}
                />
            );
        case 'locations':
          return <LocationsPage onSelectLocation={handleSelectLocation} />;
        case 'about':
            return <AboutUsPage />;
        case 'contact':
            return <ContactUsPage />;
        case 'add-listing':
            return <AddListingPage session={session} userProfile={userProfile} onListingCreated={() => handleNavigate('dashboard')} onCancel={() => handleNavigate('listings')} categoryNameToIdMap={categoryMaps.nameToId} />;
        case 'dashboard':
            return <DashboardPage session={session} userProfile={userProfile} savedListings={fullSavedListings} onSaveToggle={handleSaveToggle} onViewDetails={handleViewDetails} categoryMaps={categoryMaps} onProfileUpdate={fetchUserProfile} />;
        case 'messages':
            return <MessagesPage session={session} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationId} />;
        case 'login':
            return <AuthPage onNavigate={handleNavigate} />;
        default:
            return <div className="text-center p-12">Page not found.</div>;
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-40 bg-transparent md:block hidden">
        <Header session={session} onNavigate={handleNavigate} userProfile={userProfile} />
      </div>

      <main className="flex-grow">
          {authLoading ? (
            <div className="flex justify-center items-center h-screen">
                <img src="https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams%20Logo%20black.png" alt="Loading" className="h-12 w-auto animate-pulse" />
            </div>
          ) : renderContent()}
      </main>

      {(currentPage !== 'dashboard' && currentPage !== 'add-listing' && currentPage !== 'login') && <Footer onNavigate={handleNavigate} />}
      
      <BottomNavbar session={session} currentPage={currentPage} onNavigate={handleNavigate} />

      <Modal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} title="Filters">
        <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setIsFilterModalOpen(false)} userLocation={userLocation} />
      </Modal>

      <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title={`Book: ${bookingListing?.title || ''}`}>
          <BookingForm
              session={session}
              listing={bookingListing}
              onBookingSubmit={handleBookingSubmit}
              onClose={() => setIsBookingModalOpen(false)}
          />
      </Modal>
    </div>
  );
};

export default App;