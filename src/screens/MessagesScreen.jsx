import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ConversationListItem from '../components/ConversationListItem';

const MessagesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Unread'];
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      // In a real application, you would fetch conversations from your backend.
      // For this demo, we'll use mock data.
      const mockConversations = [
        {
          id: 'convo-1',
          otherUser: {
            id: 'user-1',
            full_name: 'Jane Doe',
            avatar_url: 'https://i.pravatar.cc/150?u=user-1',
          },
          lastMessage: {
            content: 'Hey, are you available for a booking on Friday?',
            created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          },
          unreadCount: 2,
        },
        {
          id: 'convo-2',
          otherUser: {
            id: 'user-2',
            full_name: 'John Smith',
            avatar_url: 'https://i.pravatar.cc/150?u=user-2',
          },
          lastMessage: {
            content: 'Thanks for the great service!',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
          unreadCount: 0,
        },
      ];

      setConversations(mockConversations);
      setLoading(false);
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.otherUser.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'Unread' ? conversation.unreadCount > 0 : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Messages</h1>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="flex-shrink-0 flex items-center bg-gray-200 rounded-lg p-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                activeFilter === filter ? 'bg-white text-primary shadow' : 'text-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="bg-white rounded-lg shadow-md divide-y">
        {loading ? <p className="p-8 text-center text-gray-500">Loading conversations...</p> : (
          filteredConversations.length > 0 ? (
            filteredConversations.map(convo => <ConversationListItem key={convo.id} conversation={convo} />)
          ) : (
            <div className="p-8 text-center text-gray-500">
              <h3 className="text-lg font-semibold">No Conversations Found</h3>
              <p>Your conversations will appear here.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MessagesScreen;