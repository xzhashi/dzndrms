
import React from 'react';
import { DiamondIcon, UsersIcon, ShieldCheckIcon } from './icons';

export const AboutUsPage: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <div className="relative bg-slate-800 text-white py-24 sm:py-32">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                        alt="Team working"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">About Dozen Dreams</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
                        The intersection of aspiration and acquisition. We are the curators of the world's most coveted assets.
                    </p>
                </div>
            </div>
            
            <div className="bg-slate-50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-center">
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-bold text-violet-600 leading-tight">Our Mission</h2>
                        </div>
                        <div className="lg:col-span-2 mt-6 lg:mt-0">
                            <p className="text-xl text-slate-600 leading-8">
                                To provide a seamless, trustworthy, and exclusive platform for discerning individuals to buy and sell the pinnacle of luxury. From sprawling estates to hypercars that defy physics, Dozen Dreams is more than a marketplace—it's the realization of a lifestyle.
                            </p>
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
                                    We hand-pick every listing, ensuring unparalleled quality and prestige. Only the best is good enough.
                                </p>
                            </div>
                            <div className="p-6">
                                 <div className="flex justify-center items-center mx-auto bg-violet-100 rounded-full h-16 w-16">
                                    <ShieldCheckIcon className="h-8 w-8 text-violet-600" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-900">Trust</h3>
                                <p className="mt-2 text-slate-500">
                                    Our secure platform and verified sellers provide peace of mind for transactions of any scale.
                                </p>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center items-center mx-auto bg-violet-100 rounded-full h-16 w-16">
                                    <UsersIcon className="h-8 w-8 text-violet-600" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-900">Community</h3>
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
