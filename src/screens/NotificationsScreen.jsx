import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Sample Data - In a real app, this would come from an API
const sampleNotifications = [
  {
    id: 1,
    type: 'booking',
    message: 'Your Classic Manicure with Alice Johnson is confirmed for Nov 20, 10:00 AM.',
    timestamp: '2 hours ago',
    read: false,
    link: '/booking/123',
  },
  {
    id: 2,
    type: 'system',
    message: 'New features are available! Check out our updated calendar management.',
    timestamp: 'Yesterday',
    read: false,
    link: '/beautician/dashboard',
  },
  {
    id: 3,
    type: 'message',
    message: 'Alice Johnson sent you a new message.',
    timestamp: '3 days ago',
    read: true,
    link: '/messages/1',
  },
  {
    id: 4,
    type: 'booking',
    message: 'Your Deep Tissue Massage request with David Smith is pending.',
    timestamp: '1 week ago',
    read: true,
    link: '/booking/456',
  },
];

const NotificationCard = ({ notification }) => {
  return (
    <Link to={notification.link} className={`block p-4 rounded-lg transition-colors ${notification.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`font-medium ${notification.read ? 'text-accent' : 'text-primary'}`}>{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
        </div>
        {!notification.read && (
          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-3"></span>
        )}
      </div>
    </Link>
  );
};

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Unread', 'Booking', 'Message', 'System'];

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'All') {
      return notifications;
    }
    if (activeFilter === 'Unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications.filter(n => n.type === activeFilter.toLowerCase());
  }, [notifications, activeFilter]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Notifications</h1>

      <div className="flex justify-between items-center mb-6">
        <button onClick={markAllAsRead} className="btn btn-outline btn-sm">Mark All Read</button>
        {/* Search functionality can be added here */}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => <NotificationCard key={notification.id} notification={notification} />)
        ) : (
          <div className="p-8 text-center text-gray-500">
            <h3 className="text-lg font-semibold">No Notifications</h3>
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;