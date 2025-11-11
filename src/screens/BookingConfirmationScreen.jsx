import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import { supabase } from '../supabaseClient';

// Placeholder for a success animation JSON. You'll need to replace this with an actual Lottie JSON file.
// Example: import * as successAnimation from '../assets/animations/success.json';
const successAnimation = {
  // This is a minimal valid Lottie JSON structure for demonstration.
  // Replace with your actual animation data.
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'Success Animation',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Shape Layer 1',
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [50, 50, 0], ix: 2 },
        a: { a: 0, k: [50, 50, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          nm: 'Group 1',
          it: [
            {
              ty: 'sh',
              nm: 'Path 1',
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [25, 50],
                    [45, 70],
                    [75, 30],
                  ],
                  c: true,
                },
              },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0, 0.8, 0, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 8, ix: 5 },
              lc: 1,
              lj: 1,
              ml: 4,
            },
          ],
        },
      ],
    },
  ],
};

const BookingConfirmationScreen = () => {
  const { id } = useParams(); // This `id` would typically be the booking ID
  const [showAnimation, setShowAnimation] = useState(false);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate a brief delay before showing the animation
    const timer = setTimeout(() => setShowAnimation(true), 300);

    const fetchBooking = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(name, price),
          beautician:profiles(full_name, phone, email)
        `)
        .eq('id', id)
        .single();

      if (error) {
        setError('Could not load booking confirmation.');
        console.error(error);
      } else {
        setBooking(data);
      }
      setLoading(false);
    };

    fetchBooking();

    return () => clearTimeout(timer);
  }, [id]);

  const defaultLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Confirmation...</div>;
  }

  if (error || !booking) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Booking not found.'}</div>;
  }

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {showAnimation && (
          <div className="w-32 h-32 mx-auto mb-6">
            <Lottie options={defaultLottieOptions} height={128} width={128} />
          </div>
        )}

        <h1 className="text-3xl font-heading text-accent mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-8">Your appointment with {booking.beautician.full_name} for {booking.service.name} is set.</p>

        {/* Booking Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-heading text-accent mb-4">Appointment Details</h2>
          <div className="text-left space-y-2">
            <p><strong>Service:</strong> {booking.service.name}</p>
            <p><strong>Beautician:</strong> {booking.beautician.full_name}</p>
            <p><strong>Date:</strong> {new Date(booking.booking_time).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(booking.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Price:</strong> ${booking.total_price.toFixed(2)}</p>
          </div>
        </div>

        {/* Beautician Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-heading text-accent mb-4">Contact Beautician</h2>
          <div className="flex justify-around">
            <a href={`tel:${booking.beautician.phone}`} className="btn btn-outline flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              <span>Call</span>
            </a>
            <a href={`mailto:${booking.beautician.email}`} className="btn btn-outline flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button className="w-full btn btn-secondary">Add to Calendar (Placeholder)</button>
          <Link to="/bookings" className="w-full btn btn-primary">Go to My Bookings</Link>
          <Link to="/dashboard" className="w-full btn btn-outline">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationScreen;