
import React, { useState } from 'react';
import { LocationIcon } from './icons';

export const ContactUsPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setStatus('sent');
        }, 1500);
    }

    return (
        <div className="animate-fade-in">
            <div className="bg-white py-20 px-4 text-center shadow-sm border-b border-slate-200">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Get In Touch</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
                    We're here to help. Whether you have a question about a listing or want to partner with us, we'd love to hear from you.
                </p>
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200">
                        {status === 'sent' ? (
                            <div className="text-center py-12">
                                <h3 className="text-2xl font-semibold text-violet-600">Thank You!</h3>
                                <p className="mt-2 text-slate-500">Your message has been sent. We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                        <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                                        <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                                    <input type="text" name="subject" id="subject" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                                    <textarea name="message" id="message" rows={4} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                                </div>
                                <div>
                                    <button type="submit" disabled={status === 'sending'} className="w-full bg-violet-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-violet-700 transition-all disabled:bg-slate-400">
                                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                    
                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200">
                            <h3 className="text-xl font-semibold text-slate-900">Contact Information</h3>
                            <div className="mt-6 space-y-4 text-slate-600">
                                <p><strong>Address:</strong> 123 Luxury Lane, Beverly Hills, CA 90210</p>
                                <p><strong>Phone:</strong> +1 (800) 555-DREAM</p>
                                <p><strong>Email:</strong> contact@dozendreams.com</p>
                            </div>
                        </div>
                         <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl border border-slate-200">
                            <img src="https://images.unsplash.com/photo-1594481922253-9a3d4f43c8ce?q=80&w=2070&auto=format&fit=crop" className="h-full w-full object-cover" alt="Map of Beverly Hills"/>
                            <div className="absolute inset-0 bg-black/20"></div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <LocationIcon className="w-12 h-12 text-white drop-shadow-lg" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
