import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const BookingCard = ({ booking }) => {
  const statusStyles = {
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-accent">{booking.service.name}</h3>
          <p className="text-sm text-gray-500">with {booking.beautician.full_name}</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <p>{new Date(booking.booking_time).toDateString()} at {new Date(booking.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      {/* Conditional Action Buttons */}
      <div className="flex gap-3">
        {booking.status === 'confirmed' && (
          <>
            <button className="flex-1 btn btn-outline">Reschedule</button>
            <button className="flex-1 btn btn-outline border-red-500 text-red-500 hover:bg-red-50">Cancel</button>
          </>
        )}
        {booking.status === 'completed' && (
          <>
            <Link to={`/book/${booking.service_id}`} className="flex-1 btn btn-primary text-center">Rebook</Link>
            <button className="flex-1 btn btn-outline">Leave a Review</button>
          </>
        )}
        {booking.status === 'cancelled' && (
          <Link to={`/book/${booking.service_id}`} className="flex-1 btn btn-primary text-center">Rebook</Link>
        )}
      </div>
    </div>
  );
};

const BookingsScreen = () => {
  const [activeTab, setActiveTab] = useState('Confirmed');
  const tabs = ['Upcoming', 'Past', 'Cancelled'];
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services(name),
            beautician:profiles(full_name)
          `)
          .eq('customer_id', user.id)
          .order('booking_time', { ascending: false });

        if (!error) {
          setBookings(data);
        }
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const lowerCaseTab = activeTab.toLowerCase();
    if (lowerCaseTab === 'past') {
      return bookings.filter(b => b.status === 'completed');
    }
    return bookings.filter(b => b.status === (lowerCaseTab === 'upcoming' ? 'confirmed' : lowerCaseTab));
  }, [activeTab, bookings]);

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">My Bookings</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {loading ? <p>Loading bookings...</p> :
          filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <p className="text-center text-gray-500 py-8">No {activeTab.toLowerCase()} bookings found.</p>
          )}
      </div>
    </div>
  );
};

export default BookingsScreen;