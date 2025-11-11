import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sample Data - In a real app, this would come from an API
const sampleAppointments = [
  { id: 1, client: 'Jane Doe', service: 'Classic Manicure', time: '10:00 AM', date: '2025-11-10', status: 'confirmed' },
  { id: 2, client: 'Emily Smith', service: 'Gel Manicure', time: '02:00 PM', date: '2025-11-10', status: 'confirmed' },
  { id: 3, client: 'Sarah Connor', service: 'Deep Tissue Massage', time: '04:00 PM', date: '2025-11-11', status: 'pending' },
  { id: 4, client: 'John Wick', service: 'Haircut', time: '09:00 AM', date: '2025-11-12', status: 'confirmed' },
];

const CalendarManagementScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'
  const [isAvailable, setIsAvailable] = useState(true); // Global availability toggle

  const formattedDate = selectedDate.toDateString();
  const appointmentsForSelectedDate = sampleAppointments.filter(
    app => new Date(app.date).toDateString() === formattedDate
  );

  const handleBlockTime = () => {
    alert('Block Time functionality (to be implemented)');
    // Open a modal to select time range to block
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Calendar & Availability</h1>

      {/* Calendar View and Controls */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading text-accent">Schedule for {formattedDate}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedDate(prev => new Date(prev.setDate(prev.getDate() - 1)))}
              className="btn btn-sm btn-outline"
            >&larr; Prev</button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="btn btn-sm btn-outline"
            >Today</button>
            <button
              onClick={() => setSelectedDate(prev => new Date(prev.setDate(prev.getDate() + 1)))}
              className="btn btn-sm btn-outline"
            >Next &rarr;</button>
          </div>
        </div>

        {/* Placeholder for a more advanced calendar component */}
        <div className="h-64 bg-secondary rounded-lg flex items-center justify-center mb-4">
          <p className="text-accent">Interactive Calendar Component Placeholder</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Overall Availability:</span>
            <label htmlFor="availabilityToggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="availabilityToggle"
                  className="sr-only"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(!isAvailable)}
                />
                <div className={`block ${isAvailable ? 'bg-primary' : 'bg-gray-300'} w-14 h-8 rounded-full`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isAvailable ? 'translate-x-full' : 'translate-x-0'}`}></div>
              </div>
              <div className="ml-3 text-gray-700 font-medium">
                {isAvailable ? 'Available' : 'Unavailable'}
              </div>
            </label>
          </div>
          <button onClick={handleBlockTime} className="btn btn-secondary">Block Time</button>
        </div>
      </section>

      {/* Today's Appointments/Time Slots */}
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-heading text-accent mb-4">Appointments</h2>
        {appointmentsForSelectedDate.length > 0 ? (
          <div className="space-y-4">
            {appointmentsForSelectedDate.map(app => (
              <div key={app.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <div>
                  <p className="font-bold text-accent">{app.service}</p>
                  <p className="text-sm text-gray-600">with {app.client} at {app.time}</p>
                </div>
                <div className="flex space-x-2">
                  {app.status === 'pending' && (
                    <>
                      <button className="btn btn-sm btn-primary">Accept</button>
                      <button className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-50">Decline</button>
                    </>
                  )}
                  {app.status === 'confirmed' && (
                    <Link to={`/beautician/appointment/${app.id}`} className="btn btn-sm btn-outline">View Details</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No appointments for this date.</p>
        )}
      </section>

      {/* Quick Navigation */}
      <div className="flex justify-center mt-8 space-x-4">
        <Link to="/beautician/services" className="btn btn-outline">Manage Services</Link>
        <Link to="/beautician/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default CalendarManagementScreen;