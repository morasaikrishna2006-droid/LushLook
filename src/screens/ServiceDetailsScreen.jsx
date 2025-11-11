import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ServiceDetailsScreen = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError('');

      // Fetch the service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          beautician:profiles(*)
        `)
        .eq('id', id)
        .single();

      if (serviceError) {
        setError('Could not fetch service details.');
        console.error(serviceError);
      } else {
        setServiceDetails(serviceData);
      }
      setLoading(false);
    };

    fetchServiceDetails();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading service details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Image Gallery */}
      <img 
        src={`https://images.unsplash.com/photo-1519709442222-3c4063453a2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80&h=600?seed=${serviceDetails.id}`} 
        alt={serviceDetails.name} 
        className="h-64 w-full object-cover"
      />

      <main className="p-4 sm:p-6 md:p-8">
        {/* Service Info */}
        <section className="bg-white p-6 rounded-lg shadow-md -mt-16 z-10 relative">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-heading text-accent mb-2">{serviceDetails.name}</h1>
            <button onClick={() => setIsFavorite(!isFavorite)}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${isFavorite ? 'text-primary fill-current' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-2xl font-bold text-primary mb-4">${serviceDetails.price}</p>
          <p className="text-gray-600 mb-4">Duration: {serviceDetails.duration}</p>
          <p className="font-body text-gray-700">{serviceDetails.description}</p>
        </section>

        {/* Beautician Info Card */}
        <section className="my-8">
            <Link to={`/beautician/${serviceDetails.beautician.id}`} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors">
                <img src={serviceDetails.beautician.avatar_url || `https://i.pravatar.cc/150?u=${serviceDetails.beautician.id}`} alt={serviceDetails.beautician.full_name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-accent text-lg">{serviceDetails.beautician.full_name}</h3>
                    <p className="text-sm text-gray-500">{serviceDetails.beautician.specialization || 'Beauty Professional'}</p>
                </div>
                <span className="ml-auto text-primary font-bold">&rarr;</span>
            </Link>
        </section>

        {/* Reviews Section */}
        <section className="my-8">
          <h2 className="text-2xl font-heading text-accent mb-4">Reviews</h2>
          <p className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">Reviews will be shown here.</p>
          {/* <div className="space-y-4">
            {serviceDetails.reviews.map(review => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <p className="font-bold text-accent">{review.author}</p>
                  <div className="ml-auto text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div> */}
        </section>

      </main>

      {/* Booking CTA */}
      <footer className="bg-white p-4 sticky bottom-0 shadow-lg border-t">
        <Link to={`/book/${serviceDetails.id}`}>
          <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-pink-700 transition-colors text-lg font-bold">Book Now</button>
        </Link>
      </footer>
    </div>
  );
};

export default ServiceDetailsScreen;
