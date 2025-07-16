
import React from 'react';
import { DiamondIcon, UsersIcon, ShieldCheckIcon } from './icons';

export const AboutUsPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="relative bg-slate-800 text-white py-24 sm:py-32">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                        alt="A group of people celebrating a fulfilled dream"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Fulfilling Life's Dozen Dreams</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-slate-300">
                        At Dozen Dreams, we believe life is a collection of aspirations. We are the premier destination where your most ambitious dreams become tangible realities.
                    </p>
                </div>
            </div>
            
            <div className="bg-slate-50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-left">
                         <h2 className="text-3xl font-bold text-violet-600 leading-tight mb-4">The Canvas of Your Ambitions</h2>
                         <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                            <p>
                                Everyone has their own 'dozen dreams'—those milestone achievements and peak experiences that define a life well-lived. For some, it's the thrill of owning a first luxury <strong className="font-semibold text-slate-800">car</strong>, the pride of acquiring a sprawling <strong className="font-semibold text-slate-800">property</strong>, or the legacy of investing in <strong className="font-semibold text-slate-800">land</strong>. For others, it's the joy of creating memories by booking an exclusive <strong className="font-semibold text-slate-800">trip</strong>, planning the perfect <strong className="font-semibold text-slate-800">destination</strong> wedding, or finding an unforgettable <strong className="font-semibold text-slate-800">party</strong> venue.
                            </p>
                            <p>
                                Whether your dream is a tangible asset or a once-in-a-lifetime experience, Dozen Dreams provides the key. Our mission is to provide a seamless, trustworthy, and exclusive digital platform for discovering, buying, and booking the pinnacle of luxury. We bridge the gap between desire and acquisition, making it effortless to navigate the market for:
                            </p>
                             <ul className="list-disc list-inside space-y-2 pl-4">
                                <li><strong>Exclusive Real Estate:</strong> From modern penthouses to serene villas and bungalows.</li>
                                <li><strong>Luxury & Exotic Cars:</strong> A collection of the world's most sought-after automobiles.</li>
                                <li><strong>Land & Estates:</strong> Secure your piece of legacy with prime plots and farmland.</li>
                                <li><strong>Unforgettable Experiences:</strong> Book unique destinations, party venues, and luxury stays.</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-24">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="p-6">
                                <div className="flex justify-center items-center mx-auto bg-violet-100 rounded-full h-16 w-16">
                                    <DiamondIcon className="h-8 w-8 text-violet-600" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-900">Exclusivity</h3>
                                <p className="mt-2 text-slate-500">
                                    We hand-pick every listing, ensuring unparalleled quality and prestige for your dreams.
                                </p>
                            </div>
                            <div className="p-6">
                                 <div className="flex justify-center items-center mx-auto bg-violet-100 rounded-full h-16 w-16">
                                    <ShieldCheckIcon className="h-8 w-8 text-violet-600" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-900">Trust & Security</h3>
                                <p className="mt-2 text-slate-500">
                                    Our secure platform and verified sellers provide peace of mind for transactions of any scale.
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center items-center mx-auto bg-violet-100 rounded-full h-16 w-16">
                                    <UsersIcon className="h-8 w-8 text-violet-600" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-900">A Community of Dreamers</h3>
                                <p className="mt-2 text-slate-500">
                                    Join a network of connoisseurs who share a passion for the extraordinary.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
