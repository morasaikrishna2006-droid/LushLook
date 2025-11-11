import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ServiceCard from '../components/ServiceCard';
import BeauticianProfileCard from '../components/BeauticianProfileCard';

const CustomerDashboardScreen = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredServices, setFeaturedServices] = useState([]);
  const [nearbyBeauticians, setNearbyBeauticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };
    fetchUser();

    const fetchData = async () => {
      setLoading(true);
      
      // Fetch featured services (e.g., first 3 services)
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .limit(3);
      if (!servicesError) setFeaturedServices(servicesData);

      // Fetch nearby beauticians (profiles with user_type 'beautician')
      const { data: beauticiansData, error: beauticiansError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'beautician')
        .limit(3);
      if (!beauticiansError) setNearbyBeauticians(beauticiansData);

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-heading text-accent">
          Welcome, {user?.user_metadata?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">Ready to find your next beauty treatment?</p>
      </header>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit}>
          <input 
            type="text" 
            placeholder="Search for services or beauticians..." 
            className="w-full px-6 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Featured Services */}
      <section className="mb-8">
        <h2 className="text-2xl font-heading text-accent mb-4">Featured Services</h2>
        {loading ? <p>Loading services...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* Nearby Beauticians */}
      <section className="mb-8">
        <h2 className="text-2xl font-heading text-accent mb-4">Nearby Beauticians</h2>
        {loading ? <p>Loading beauticians...</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyBeauticians.map(beautician => (
              // Note: BeauticianProfileCard might need adjustments to match profile data
              <BeauticianProfileCard key={beautician.id} beautician={{...beautician, name: beautician.full_name}} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Bookings */}
      <section>
        <h2 className="text-2xl font-heading text-accent mb-4">Recent Bookings</h2>
        {/* Placeholder for booking widget */}
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          {loading ? <p>Loading bookings...</p> : (
            <p className="text-accent">Recent bookings will appear here.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default CustomerDashboardScreen;
