import React from 'react';
import { Link } from 'react-router-dom';

const ConversationListItem = ({ conversation }) => {
  const { otherUser, lastMessage, unreadCount } = conversation;

  return (
    <Link to={`/chat/${otherUser.id}`} className="block p-4 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="relative flex-shrink-0">
          <img 
            src={otherUser.avatar_url} 
            alt={otherUser.full_name} 
            className="w-12 h-12 rounded-full object-cover"
          />
          {/* Online status can be implemented with Supabase Realtime Presence */}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-bold text-accent truncate">{otherUser.full_name}</p>
            <p className="text-xs text-gray-500">
              {new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex justify-between items-start mt-1">
            <p className="text-sm text-gray-600 truncate">{lastMessage.content}</p>
            {unreadCount > 0 && (
              <span className="flex-shrink-0 ml-2 px-2 py-0.5 text-xs font-bold text-white bg-primary rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ConversationListItem;
