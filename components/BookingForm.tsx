import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Listing, BookingData } from '../types';
import { Button } from './Button';
import { CalendarIcon } from './icons';

interface BookingFormProps {
    session: Session | null;
    listing: Listing | null;
    onBookingSubmit: (data: Omit<BookingData, 'listingId' | 'listingTitle'>) => Promise<void>;
    onClose: () => void;
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({ label, ...props}) => (
    <div>
      <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700">{label}</label>
      <input {...props} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm bg-white/70 p-3" />
    </div>
);

export const BookingForm: React.FC<BookingFormProps> = ({ session, listing, onBookingSubmit, onClose }) => {
    const [fullName, setFullName] = useState(session?.user?.user_metadata?.full_name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (!checkIn || !checkOut) {
            setError('Please select both check-in and check-out dates.');
            return;
        }
        if (checkOutDate <= checkInDate) {
            setError('Check-out date must be after the check-in date.');
            return;
        }
        if (guests < 1) {
             setError('Number of guests must be at least 1.');
             return;
        }

        setIsSubmitting(true);
        await onBookingSubmit({
            fullName,
            email,
            guests,
            checkIn: checkInDate,
            checkOut: checkOutDate
        });
        setIsSubmitting(false);
    };

    if (!listing) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" type="text" name="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
                <Input label="Email Address" type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <Input label="Check-in Date" type="date" name="checkIn" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={today} required />
                <Input label="Check-out Date" type="date" name="checkOut" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || today} required />
                <Input label="Guests" type="number" name="guests" value={guests} onChange={e => setGuests(parseInt(e.target.value, 10))} min="1" required />
             </div>
             {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
             <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    <CalendarIcon className="w-5 h-5" />
                </Button>
             </div>
        </form>
    );
};
