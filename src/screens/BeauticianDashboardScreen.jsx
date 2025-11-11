import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const BeauticianDashboardScreen = () => {
  const [earningsPeriod, setEarningsPeriod] = useState('today'); // 'today', 'week', 'month'
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Fetch beautician's profile
        const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        setProfile(profileData);

        // Fetch today's confirmed appointments
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const { data: appointmentData } = await supabase
          .from('bookings')
          .select(`
            id, booking_time,
            customer:profiles(full_name),
            service:services(name)
          `)
          .eq('beautician_id', user.id)
          .eq('status', 'confirmed')
          .gte('booking_time', startOfDay)
          .lte('booking_time', endOfDay)
          .order('booking_time', { ascending: true });
        
        setAppointments(appointmentData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Placeholder data for now
  const currentEarnings = 0;
  const quickStats = { totalServices: 0, totalClients: 0, averageRating: 0 };
  const pendingRequests = [];

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Welcome, {profile?.full_name || 'Beautician'}!</h1>

      {/* Earnings Widget */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading text-accent">Your Earnings</h2>
          <select
            value={earningsPeriod}
            onChange={(e) => setEarningsPeriod(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <p className="text-4xl font-bold text-primary">${currentEarnings.toFixed(2)}</p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Total Services</p>
          <p className="text-3xl font-bold text-accent">{quickStats.totalServices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Total Clients</p>
          <p className="text-3xl font-bold text-accent">{quickStats.totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-sm">Average Rating</p>
          <p className="text-3xl font-bold text-accent">{quickStats.averageRating}</p>
        </div>
      </section>

      {/* Today's Appointments */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-heading text-accent mb-4">Today's Appointments</h2>
        {loading ? <p>Loading appointments...</p> : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map(app => (
              <div key={app.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <div>
                  <p className="font-bold text-accent">{app.service.name}</p>
                  <p className="text-sm text-gray-600">with {app.customer.full_name} at {new Date(app.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <Link to={`/booking/${app.id}`} className="btn btn-sm btn-outline">View</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no appointments scheduled for today.</p>
        )}
      </section>

      {/* Pending Requests */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-heading text-accent mb-4 flex items-center">
          Pending Requests
          {pendingRequests.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingRequests.length} New
            </span>
          )}
        </h2>
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <div>
                  <p className="font-bold text-accent">{req.service.name}</p>
                  <p className="text-sm text-gray-600">from {req.customer.full_name} on {new Date(req.booking_time).toLocaleDateString()}</p>
                </div>
                <Link to={`/beautician/request/${req.id}`} className="btn btn-sm btn-primary">Review</Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No pending requests.</p>
        )}
      </section>

      {/* Quick Actions */}
      <section className="flex justify-center mt-8">
        <Link to="/beautician/service/new" className="btn btn-primary text-lg px-8 py-3">
          + Add New Service
        </Link>
      </section>
    </div>
  );
};

export default BeauticianDashboardScreen;