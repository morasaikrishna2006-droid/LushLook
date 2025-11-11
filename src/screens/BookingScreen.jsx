import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const availableTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

const BookingScreen = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select(`
          id, name, price, duration, beautician_id,
          beautician:profiles(full_name)
        `)
        .eq('id', serviceId)
        .single();

      if (error) {
        setError('Could not fetch service information.');
        console.error(error);
      } else {
        setService(data);
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }

    fetchService();
    fetchUser();
  }, [serviceId]);

  const handleConfirmBooking = async () => {
    if (!selectedTime || !user) {
      alert('Please select a time slot to continue.');
      return;
    }

    setLoading(true);
    const bookingDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(/:| /);
    bookingDateTime.setHours(parseInt(hours) + (selectedTime.includes('PM') && hours !== '12' ? 12 : 0), parseInt(minutes) || 0, 0);

    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: user.id,
        beautician_id: service.beautician_id,
        service_id: service.id,
        booking_time: bookingDateTime.toISOString(),
        status: 'pending_payment',
        total_price: service.price * 1.05, // Including 5% tax
        special_requests: specialRequests,
      })
      .select()
      .single();

    setLoading(false);

    if (bookingError) {
      setError('Failed to create booking. Please try again.');
      console.error(bookingError);
    } else {
      // Navigate to the payment screen with the real booking ID
      navigate(`/payment/${newBooking.id}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading booking details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  const tax = service.price * 0.05; // Example 5% tax
  const total = service.price + tax;

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <Link to={`/service/${serviceId}`} className="text-primary font-bold mb-4 inline-block">&larr; Back to Service</Link>
      <h1 className="text-3xl font-heading text-accent mb-8">Book Your Appointment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Date and Time Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* Calendar Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-heading text-accent mb-4">Select a Date</h2>
            <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
                <p className="text-accent">Calendar Component Placeholder</p>
            </div>
          </div>
          
          {/* Time Slot Grid */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-heading text-accent mb-4">Select a Time</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {availableTimeSlots.map(time => (
                <button 
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border text-center ${selectedTime === time ? 'bg-primary text-white border-primary' : 'bg-white hover:border-primary'}`}>
                    {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-heading text-accent mb-4">Booking Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="font-bold">{service.name}</p>
                <p>${service.price.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500">with {service.beautician.full_name}</p>
              <hr />
              <div className="flex justify-between">
                <p>Taxes & Fees</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-6">
              <textarea 
                placeholder="Add any special requests..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-heading text-accent mb-3">Payment Method</h3>
                {/* Payment Method Placeholder */}
                <div className="h-24 bg-secondary rounded-lg flex items-center justify-center">
                    <p className="text-accent">Payment Form Placeholder</p>
                </div>
            </div>

            <button onClick={handleConfirmBooking} className="w-full bg-primary text-white py-3 mt-6 rounded-lg hover:bg-pink-700 transition-colors text-lg font-bold">Confirm & Book</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;
