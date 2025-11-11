import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Sample Data - In a real app, you would fetch this based on the :id param
const sampleBookingDetails = {
  id: 'booking123', // Corresponds to the :id in the URL
  status: 'confirmed', // Can be 'pending', 'confirmed', 'completed', 'cancelled'
  serviceName: 'Classic Manicure',
  servicePrice: 45.0,
  serviceDuration: '60 min',
  beauticianName: 'Alice Johnson',
  beauticianPhone: '+1234567890',
  beauticianEmail: 'alice@example.com',
  date: '2025-11-20',
  time: '10:00 AM',
  address: '123 Beauty St, Suite 400, New York, NY 10001',
  serviceId: 1, // Used for rebooking
};

const BookingDetailsScreen = () => {
  const { id } = useParams(); // This `id` would typically be the booking ID
  const [bookingDetails, setBookingDetails] = useState(sampleBookingDetails);

  // In a real app, you would fetch booking details based on `id`
  useEffect(() => {
    // Simulate API call
    // setBookingDetails(fetchedData);
  }, [id]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReschedule = () => {
    alert('Reschedule functionality (to be implemented)');
    // Navigate to a reschedule flow or open a modal
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      alert('Cancel functionality (to be implemented)');
      // Call API to cancel booking, then update state or navigate
      setBookingDetails(prev => ({ ...prev, status: 'cancelled' }));
    }
  };

  const handleLeaveReview = () => {
    alert('Leave Review functionality (to be implemented)');
    // Navigate to a review submission screen
  };

  const handleRebook = () => {
    alert('Rebook functionality (to be implemented)');
    // Navigate to the booking screen for this service
  };

  const isUpcoming = bookingDetails.status === 'pending' || bookingDetails.status === 'confirmed';
  const isCompleted = bookingDetails.status === 'completed';
  const isCancelled = bookingDetails.status === 'cancelled';

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <Link to="/bookings" className="text-primary font-bold mb-4 inline-block">&larr; Back to My Bookings</Link>
      <h1 className="text-3xl font-heading text-accent mb-6">Booking Details</h1>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg shadow-md mb-6 flex items-center justify-between ${getStatusStyles(bookingDetails.status)}`}>
        <p className="font-bold text-lg">Status: {bookingDetails.status.toUpperCase()}</p>
        {isUpcoming && (
          <span className="text-sm font-medium">Upcoming</span>
        )}
        {isCompleted && (
          <span className="text-sm font-medium">Completed</span>
        )}
        {isCancelled && (
          <span className="text-sm font-medium">Cancelled</span>
        )}
      </div>

      {/* Service Details Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-heading text-accent mb-4">Service Information</h2>
        <div className="space-y-2">
          <p><strong>Service:</strong> {bookingDetails.serviceName}</p>
          <p><strong>Price:</strong> ${bookingDetails.servicePrice.toFixed(2)}</p>
          <p><strong>Duration:</strong> {bookingDetails.serviceDuration}</p>
        </div>
      </div>

      {/* Beautician Info Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-heading text-accent mb-4">Beautician</h2>
        <p className="mb-4"><strong>Name:</strong> {bookingDetails.beauticianName}</p>
        <div className="flex justify-around">
          <a href={`tel:${bookingDetails.beauticianPhone}`} className="btn btn-outline flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
            <span>Call</span>
          </a>
          <a href={`mailto:${bookingDetails.beauticianEmail}`} className="btn btn-outline flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            <span>Email</span>
          </a>
        </div>
      </div>

      {/* Date, Time, and Address */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-heading text-accent mb-4">Appointment Details</h2>
        <div className="space-y-2">
          <p><strong>Date:</strong> {new Date(bookingDetails.date).toDateString()}</p>
          <p><strong>Time:</strong> {bookingDetails.time}</p>
          <p><strong>Address:</strong> {bookingDetails.address}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {isUpcoming && (
          <>
            <button onClick={handleReschedule} className="w-full btn btn-secondary">Reschedule</button>
            <button onClick={handleCancel} className="w-full btn btn-outline border-red-500 text-red-500 hover:bg-red-50">Cancel Booking</button>
          </>
        )}
        {isCompleted && (
          <>
            <button onClick={handleLeaveReview} className="w-full btn btn-primary">Leave a Review</button>
            <Link to={`/book/${bookingDetails.serviceId}`} className="w-full btn btn-secondary text-center">Rebook Service</Link>
          </>
        )}
        {isCancelled && (
          <Link to={`/book/${bookingDetails.serviceId}`} className="w-full btn btn-primary text-center">Rebook Service</Link>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsScreen;