
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { Conversation, Message } from '../types';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { ChatIcon } from './icons';

interface MessagesPageProps {
  session: Session | null;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ session, activeConversationId, setActiveConversationId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const { data: convosData, error: convosError } = await supabase
      .from('conversations')
      .select(`
        *,
        listings (title, image_url),
        buyer:profiles!conversations_buyer_id_fkey(full_name),
        seller:profiles!conversations_seller_id_fkey(full_name)
      `)
      .or(`buyer_id.eq.${session.user.id},seller_id.eq.${session.user.id}`)
      .order('updated_at', { ascending: false });

    if (convosError) {
      console.error('Error fetching conversations:', convosError);
      setLoading(false);
      return;
    }
    
    // Fetch last message and unread count for each conversation
    const enrichedConversations = await Promise.all(
        (convosData as any[]).map(async (convo) => {
            const { data: lastMessage, error: lastMessageError } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('conversation_id', convo.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
            
            const { count, error: unreadError } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('conversation_id', convo.id)
                .eq('is_read', false)
                .neq('sender_id', session.user.id);
            
            return {
                ...convo,
                last_message: lastMessage?.content || 'No messages yet.',
                last_message_at: lastMessage?.created_at,
                unread_count: unreadError ? 0 : count,
                // Simplify the other user's profile data
                profiles: convo.buyer_id === session.user.id ? convo.seller : convo.buyer,
            };
        })
    );
    
    setConversations(enrichedConversations);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
      if(!session) return;
      
      const channel = supabase
        .channel('public:messages')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
            // Re-fetch conversations to update last message and unread count
            fetchConversations();
        })
        .subscribe();

      return () => {
          supabase.removeChannel(channel);
      };
  }, [session, fetchConversations]);

  const selectedConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 animate-fade-in h-screen max-h-screen">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 h-full flex flex-col">
        <div className="p-4 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">Messages</h1>
        </div>
        <div className="flex-grow grid grid-cols-12 overflow-hidden">
          <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-slate-200 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              currentUserId={session?.user.id}
              selectedConversationId={activeConversationId}
              onSelectConversation={(id) => setActiveConversationId(id)}
              loading={loading}
            />
          </div>
          <div className="hidden md:block md:col-span-8 lg:col-span-9 h-full">
            {selectedConversation && session ? (
              <ChatWindow
                key={selectedConversation.id}
                conversation={selectedConversation}
                currentUser={session.user}
                onMessagesRead={fetchConversations}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 bg-slate-50">
                <ChatIcon className="w-16 h-16 text-slate-300" />
                <h2 className="mt-4 text-lg font-semibold text-slate-700">Select a conversation</h2>
                <p className="mt-1 text-sm">Choose a conversation from the left to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
