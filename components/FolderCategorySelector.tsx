import React from 'react';
import { ListingCategory, ListingType } from '../types';
import { SALE_CATEGORIES, BOOK_CATEGORIES } from '../constants';

interface FolderCategorySelectorProps {
  activeListingType: ListingType;
  onListingTypeChange: (type: ListingType) => void;
  onCategorySelect: (category: ListingCategory) => void;
}

const Folder: React.FC<{
  title: string;
  categories: { id: ListingCategory; label: string; imageUrl: string }[];
  photos: string[];
  onCategorySelect: (category: ListingCategory) => void;
}> = ({ title, categories, photos, onCategorySelect }) => {
  return (
    <div className="folder-wrapper">
      <div className="folder">
        <div className="folder-photos">
          {photos.slice(0, 3).map((src, index) => (
            <div key={index} className="photo" style={{ transform: `rotate(${Math.random() * 12 - 6}deg)` }}>
              <img src={src} alt={`Peeking photo ${index + 1}`} />
            </div>
          ))}
        </div>
        <div className="folder-back"></div>
        <div className="folder-front">
          <div className="category-list">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onCategorySelect(cat.id);
                }}
                className="w-full text-left text-slate-600 hover:text-slate-800 font-medium p-2 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-3"
              >
                <img src={cat.imageUrl} alt={cat.label} className="w-6 h-6 rounded-full object-cover" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <h3 className="folder-title">{title}</h3>
    </div>
  );
};

export const FolderCategorySelector: React.FC<FolderCategorySelectorProps> = ({
  activeListingType,
  onListingTypeChange,
  onCategorySelect
}) => {
  const salePhotos = [
    SALE_CATEGORIES.find(c => c.id === ListingCategory.VILLA_SALE)?.imageUrl,
    SALE_CATEGORIES.find(c => c.id === ListingCategory.CAR_SALE)?.imageUrl,
    SALE_CATEGORIES.find(c => c.id === ListingCategory.YACHT_SALE)?.imageUrl,
  ].filter((url): url is string => !!url);

  const bookPhotos = [
    BOOK_CATEGORIES.find(c => c.id === ListingCategory.STAY_RENTAL)?.imageUrl,
    BOOK_CATEGORIES.find(c => c.id === ListingCategory.DESTINATION_BOOK)?.imageUrl,
    BOOK_CATEGORIES.find(c => c.id === ListingCategory.YACHT_RENTAL)?.imageUrl,
  ].filter((url): url is string => !!url);

  return (
    <div className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Explore Our Categories</h2>
            <p className="text-lg text-center text-slate-500 mb-16">Find exactly what you're looking for.</p>
            <div className="folder-container">
                <div onMouseEnter={() => onListingTypeChange(ListingType.SALE)}>
                    <Folder
                        title="For Sale"
                        categories={SALE_CATEGORIES}
                        photos={salePhotos}
                        onCategorySelect={onCategorySelect}
                    />
                </div>
                 <div onMouseEnter={() => onListingTypeChange(ListingType.RENT)}>
                    <Folder
                        title="To Book"
                        categories={BOOK_CATEGORIES}
                        photos={bookPhotos}
                        onCategorySelect={onCategorySelect}
                    />
                </div>
            </div>
      </div>
    </div>
  );
};