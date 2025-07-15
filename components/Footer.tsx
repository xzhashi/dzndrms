import React from 'react';
import { DiamondIcon } from './icons';
import { Page } from '../types';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const buttonClass = "text-base text-left text-slate-600 hover:text-violet-600";
  
  return (
    <footer className="bg-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
             <button onClick={() => onNavigate('listings')} className="flex items-center space-x-3">
              <DiamondIcon className="h-8 w-8 text-violet-600" />
              <span className="text-2xl font-semibold text-slate-900 tracking-wider">Dozen Dreams</span>
            </button>
            <p className="mt-4 text-slate-500 text-sm">
                The premier destination for the world's most desirable properties and vehicles.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase">For Sale</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Real Estate</a></li>
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Luxury Cars</a></li>
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Farms & Ranches</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase">To Book</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Luxury Stays</a></li>
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Exotic Cars</a></li>
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Farmhouses</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><button onClick={() => onNavigate('about')} className={buttonClass}>About Us</button></li>
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">List With Us</a></li>
              <li><button onClick={() => onNavigate('contact')} className={buttonClass}>Contact</button></li>
              <li><a href="#" className="text-base text-slate-600 hover:text-violet-600">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 flex items-center justify-between">
          <p className="text-base text-slate-500">&copy; 2024 Dozen Dreams. All rights reserved.</p>
          {/* Social media icons would go here */}
        </div>
      </div>
    </footer>
  );
};