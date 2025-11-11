import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { supabase } from '../supabaseClient';

const PaymentScreen = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  
  const [booking, setBooking] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service:services(name, price),
          beautician:profiles(full_name)
        `)
        .eq('id', bookingId)
        .single();

      if (error) {
        setError('Could not load booking details.');
        console.error(error);
      } else {
        setBooking(data);
      }
      setLoading(false);
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate payment and update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    setLoading(false);

    if (updateError) {
      setError('There was an issue confirming your booking. Please try again.');
      console.error(updateError);
    } else {
      // On successful "payment", navigate to the confirmation screen
      navigate(`/booking-confirmation/${bookingId}`);
    }
  };

  if (loading || !booking) {
    return <div className="min-h-screen flex items-center justify-center">Loading payment details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const tax = booking.total_price - booking.service.price;

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <Link to={`/book/${booking.service_id}`} className="text-primary font-bold mb-4 inline-block">&larr; Back to Booking</Link>
      <h1 className="text-3xl font-heading text-accent mb-8">Confirm and Pay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-heading text-accent mb-4">Payment Method</h2>
            <p className="text-gray-600 mb-4">Enter your card details. Your payment is securely processed by Stripe.</p>
            <div className="p-4 border rounded-lg">
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }} />
            </div>
            <p className="text-sm text-gray-500 text-center">Your payment is securely processed by Stripe.</p>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-heading text-accent mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="font-bold">{booking.service.name}</p>
                <p>${booking.service.price.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500">Date: {new Date(booking.booking_time).toLocaleDateString()} at {new Date(booking.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <hr />
              <div className="flex justify-between">
                <p>Taxes & Fees</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <hr />
              {/* Promo Code */}
              <div className="flex items-center space-x-2">
                <input 
                    type="text"
                    placeholder="Promo Code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">Apply</button>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${booking.total_price.toFixed(2)}</p>
              </div>
            </div>

            <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-primary text-white py-3 mt-6 rounded-lg hover:bg-pink-700 transition-colors text-lg font-bold disabled:bg-pink-300 disabled:cursor-not-allowed">
                {loading ? 'Processing...' : `Pay $${booking.total_price.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
