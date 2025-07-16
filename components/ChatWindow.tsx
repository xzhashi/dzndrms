
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { Conversation, Message } from '../types';
import type { User } from '@supabase/supabase-js';
import { Button } from './Button';
import { ArrowRightIcon } from './icons';

interface ChatWindowProps {
    conversation: Conversation;
    currentUser: User;
    onMessagesRead: () => void;
}

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onMessagesRead }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const otherUser = conversation.profiles;
    const listing = conversation.listings;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*, sender:profiles(fullName)')
                .eq('conversation_id', conversation.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data as any[]);
            }
            setLoading(false);
        };

        fetchMessages();
    }, [conversation.id]);
    
    useEffect(() => {
        // Mark messages as read when window opens
        const markAsRead = async () => {
             const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversation.id)
                .neq('sender_id', currentUser.id);

            if (error) console.error("Error marking messages as read", error);
            else onMessagesRead();
        }
        markAsRead();
    }, [conversation.id, currentUser.id, onMessagesRead]);

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const channel = supabase
            .channel(`chat:${conversation.id}`)
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'messages',
                    filter: `conversation_id=eq.${conversation.id}`
                }, 
                (payload) => {
                    setMessages(currentMessages => [...currentMessages, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversation.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const content = newMessage.trim();
        setNewMessage('');

        const { error } = await supabase.from('messages').insert({
            conversation_id: conversation.id,
            sender_id: currentUser.id,
            content: content,
        });

        if (error) {
            console.error('Error sending message:', error);
            // Optionally, handle UI to show message failed to send
            setNewMessage(content); // Re-populate the input
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><p>Loading messages...</p></div>
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <img src={listing.image_url} alt={listing.title} className="w-10 h-10 rounded-md object-cover" />
                <div>
                    <h3 className="font-bold text-slate-800 truncate">{otherUser.full_name}</h3>
                    <p className="text-xs text-slate-500 truncate">RE: {listing.title}</p>
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map(message => {
                    const isSender = message.sender_id === currentUser.id;
                    return (
                        <div key={message.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${isSender ? 'bg-violet-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${isSender ? 'text-violet-200' : 'text-slate-500'} text-right`}>
                                    {formatTime(message.created_at)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-slate-100 border-slate-200 rounded-full py-2.5 px-4 text-sm focus:ring-violet-500 focus:border-violet-500 transition"
                        autoComplete="off"
                    />
                    <Button type="submit" className="flex-shrink-0 !rounded-full !p-3">
                        <ArrowRightIcon className="w-5 h-5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
