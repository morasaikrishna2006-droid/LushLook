import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ConversationListItem = ({ user }) => (
  <Link to={`/chat/${user.id}`} className="block p-4 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center space-x-4">
      <div className="relative flex-shrink-0">
        <img 
          src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`} 
          alt={user.full_name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        {/* Online status can be implemented with Supabase Realtime Presence */}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-bold text-accent truncate">{user.full_name}</p>
          {/* Timestamp of last message can be added here */}
        </div>
        <div className="flex justify-between items-start mt-1">
          <p className="text-sm text-gray-600 truncate">Click to view conversation</p>
          {/* Unread count can be added here */}
        </div>
      </div>
    </div>
  </Link>
);

const MessagesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Unread'];
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For this demo, we'll fetch all beauticians for a customer to chat with.
    // A more advanced implementation would fetch users you already have messages with.
    const fetchConversations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'beautician'); // Fetch all beauticians

      if (!error) {
        setConversations(data);
      }
      setLoading(false);
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    // Placeholder logic for the filter button. This will be expanded when unread counts are available.
    const matchesFilter = activeFilter === 'Unread' 
      ? false // Currently, shows no results for "Unread" as we don't track this state yet.
      : true; // Shows all results for "All".

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
            filteredConversations.map(user => <ConversationListItem key={user.id} user={user} />)
          ) : (
            <div className="p-8 text-center text-gray-500">
              <h3 className="text-lg font-semibold">No Beauticians Found</h3>
              <p>Your conversations with beauticians will appear here.</p>
            </div>
          ) // Closes the inner conditional (filteredConversations.length > 0)
        )} {/* Closes the outer conditional (loading) */}
      </div>
    </div>
  );
};

export default MessagesScreen;