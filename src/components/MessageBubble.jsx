import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MessageBubble = ({ message }) => {
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user));
  }, []);

  if (!currentUser) return null;

  const isUser = message.sender_id === currentUser.id;

  const getStatusIcon = () => {
    if (message.status === 'read') {
      return <span className="ml-1 text-blue-500">✓✓</span>;
    }
    if (message.status === 'delivered') {
      return <span className="ml-1 text-gray-400">✓✓</span>;
    }
    return <span className="ml-1 text-gray-400">✓</span>;
  };

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        <p>{message.content}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-pink-200' : 'text-gray-500'} text-right`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isUser && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
