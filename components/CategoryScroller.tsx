import React from 'react';
import { ListingCategory, ListingType } from '../types';
import { SALE_CATEGORIES, BOOK_CATEGORIES } from '../constants';

interface CategoryScrollerProps {
    listingType: ListingType;
    selectedCategory: ListingCategory | null;
    onCategorySelect: (category: ListingCategory) => void;
}

export const CategoryScroller: React.FC<CategoryScrollerProps> = ({ listingType, selectedCategory, onCategorySelect }) => {
    const categories = listingType === ListingType.SALE ? SALE_CATEGORIES : BOOK_CATEGORIES;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-start gap-4 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onCategorySelect(cat.id)}
                            className={`relative flex-shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 transition-colors duration-200
                                ${isSelected 
                                    ? 'text-slate-900' 
                                    : 'text-slate-500 hover:text-slate-900 opacity-80 hover:opacity-100'
                                }`}
                            aria-pressed={isSelected}
                            aria-label={`Filter by ${cat.label}`}
                        >
                            <img src={cat.imageUrl} alt={cat.label} className="w-7 h-7 rounded-full object-cover" />
                            <span className={`text-xs font-medium whitespace-nowrap ${isSelected ? 'font-bold' : ''}`}>{cat.label}</span>
                             {isSelected && <div className="absolute bottom-0 w-8/12 h-[2px] bg-slate-900 rounded-full" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};