
import React from 'react';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId?: string;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  loading: boolean;
}

const ConversationItem: React.FC<{
  convo: Conversation;
  isSelected: boolean;
  onClick: () => void;
}> = ({ convo, isSelected, onClick }) => {
    const otherUser = convo.profiles;
    const listing = convo.listings;

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 border-b border-slate-200 hover:bg-slate-100 transition-colors duration-150 ${isSelected ? 'bg-violet-50' : 'bg-white'}`}
        >
            <div className="flex items-center gap-3">
                <img src={listing?.image_url || 'https://placehold.co/100x100'} alt={listing?.title || 'Listing'} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-start">
                        <p className="font-semibold text-slate-800 truncate">{otherUser?.full_name || 'User'}</p>
                        {convo.unread_count && convo.unread_count > 0 ? (
                            <span className="bg-violet-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">{convo.unread_count}</span>
                        ) : null}
                    </div>
                    <p className="text-sm text-slate-600 truncate">{listing?.title || 'Unknown Listing'}</p>
                    <p className="text-xs text-slate-400 truncate mt-1">{convo.last_message}</p>
                </div>
            </div>
        </button>
    );
};


export const ConversationList: React.FC<ConversationListProps> = ({ conversations, currentUserId, selectedConversationId, onSelectConversation, loading }) => {
    if (loading) {
        return (
            <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-12 h-12 rounded-md bg-slate-200"></div>
                        <div className="flex-grow space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-slate-500">
                <p>You have no conversations.</p>
                <p className="mt-2">Contact an agent on a listing page to start a new chat.</p>
            </div>
        );
    }
  
  return (
    <div className="h-full">
      {conversations.map(convo => (
        <ConversationItem
          key={convo.id}
          convo={convo}
          isSelected={selectedConversationId === convo.id}
          onClick={() => onSelectConversation(convo.id)}
        />
      ))}
    </div>
  );
};
