import React, { useState, useEffect } from 'react';
import { UserProfile, ListingCategory } from '../types';
import { supabase } from '../services/supabaseClient';
import { Button } from './Button';
import { SALE_CATEGORIES, BOOK_CATEGORIES } from '../constants';

interface ProfileSettingsProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (userId: string) => void;
}

const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userProfile, onProfileUpdate }) => {
    const [fullName, setFullName] = useState('');
    const [budget, setBudget] = useState(5000000);
    const [interests, setInterests] = useState<ListingCategory[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.fullName || '');
            setBudget(userProfile.budget || 5000000);
            setInterests(userProfile.interests || []);
        }
    }, [userProfile]);

    const handleInterestChange = (category: ListingCategory) => {
        setInterests(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSave = async () => {
        if (!userProfile) return;
        
        setIsSaving(true);
        setMessage('');

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                budget: budget,
                interests: interests,
            })
            .eq('id', userProfile.id);
        
        setIsSaving(false);

        if (error) {
            setMessage('Error: Could not save profile. ' + error.message);
        } else {
            setMessage('Profile updated successfully!');
            onProfileUpdate(userProfile.id);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (!userProfile) {
        return <div>Loading profile...</div>;
    }
    
    const allCategories = [...SALE_CATEGORIES, ...BOOK_CATEGORIES].filter(
      (value, index, self) => self.findIndex(v => v.id === value.id) === index
    );

    return (
        <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 space-y-10">
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h3>
                <p className="text-slate-500">Update your personal details and preferences.</p>
            </div>
            
            <div className="space-y-6">
                {/* Personal Info */}
                <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h4>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 block w-full max-w-lg rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-white/70 p-3"
                        />
                    </div>
                </div>

                {/* Budget */}
                <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">My Budget</h4>
                    <div className="max-w-lg">
                         <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                            <span>₹0</span>
                            <span className="font-semibold text-slate-800 bg-slate-200 px-2 py-1 rounded-md">{formatPrice(budget)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100000000" // 10 Cr
                            step="100000"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-violet-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-slate-500 mt-2">Set your approximate maximum budget for purchases or bookings.</p>
                    </div>
                </div>

                {/* Interests */}
                <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">My Interests</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {allCategories.map(cat => (
                            <label key={cat.id} className="flex items-center gap-2 p-3 rounded-md border cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={interests.includes(cat.id)}
                                    onChange={() => handleInterestChange(cat.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                />
                                <span className="text-sm font-medium text-slate-700">{cat.label}</span>
                            </label>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Select the categories that you are most interested in.</p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                {message && <p className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};