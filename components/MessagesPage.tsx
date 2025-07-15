
import React from 'react';
import { ChatIcon } from './icons';

export const MessagesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
      <div className="text-center">
        <div className="flex justify-center items-center mb-4">
            <ChatIcon className="w-16 h-16 text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Messages Coming Soon</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          This feature will allow you to communicate with sellers and agents directly through the platform.
        </p>
      </div>
    </div>
  );
};
