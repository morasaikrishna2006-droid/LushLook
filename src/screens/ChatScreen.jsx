import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import MessageBubble from '../components/MessageBubble';

const ChatScreen = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const setupChat = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Get the profile of the other user in the chat
      const { data: otherUserData, error: otherUserError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!otherUserError) setOtherUser(otherUserData);

      // Fetch initial message history
      const { data: initialMessages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`(sender_id.eq.${user.id},receiver_id.eq.${userId}),(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (!messagesError) {
        const messagesWithStatus = initialMessages.map(m => ({ ...m, status: 'delivered' }));
        setMessages(messagesWithStatus);
      }
    };

    setupChat();

    // Set up real-time subscription for new messages
    if (currentUser?.id && userId) {
      const channelId = [currentUser.id, userId].sort().join(':');
      const subscription = supabase
        .channel(`chat:${channelId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          const newMessage = { ...payload.new, status: 'delivered' };
          setMessages(prevMessages => [...prevMessages, newMessage]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [userId, currentUser?.id]);

  useEffect(() => {
    // Simulate marking messages as read when the chat is opened
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.sender_id === userId ? { ...msg, status: 'read' } : msg
      )
    );
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: userId,
      content: newMessage,
    };

    // Add message to local state immediately for better UX
    const optimisticMessage = {
      ...messageData,
      id: Math.random(), // temporary id
      created_at: new Date().toISOString(),
      status: 'sent',
    };
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);

    setNewMessage('');

    const { error } = await supabase.from('messages').insert([messageData]).select();
    if (error) {
      console.error('Error sending message:', error);
      // Optionally, update message status to 'failed'
      setMessages(prevMessages => prevMessages.map(m => m.id === optimisticMessage.id ? { ...m, status: 'failed' } : m));
    }
  };

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-accent">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow-md z-10">
        <Link to="/messages" className="text-primary mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div className="relative">
          <img src={otherUser.avatar_url || `https://i.pravatar.cc/150?u=${otherUser.id}`} alt={otherUser.full_name} className="w-10 h-10 rounded-full object-cover" />
          {/* Online status can be implemented with Supabase Realtime Presence */}
          {/* {otherUser.isOnline && (
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
          )} */}
        </div>
        <div className="ml-3">
          <h1 className="font-bold text-accent">{otherUser.full_name}</h1>
          {/* <p className="text-sm text-gray-500">{otherUser.isOnline ? 'Online' : 'Offline'}</p> */}
        </div>
      </header>

      {/* Message History */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Message Input */}
      <footer className="bg-white p-4 shadow-up">
        {/* Placeholder for booking quick actions */}
        <div className="text-center text-xs text-gray-400 mb-2">
          Quick Actions: <button className="text-primary underline">Confirm Booking</button>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button type="button" className="p-2 text-gray-500 hover:text-primary">
            {/* Attachment Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="p-2 rounded-full bg-primary text-white hover:bg-pink-700">
            {/* Send Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatScreen;