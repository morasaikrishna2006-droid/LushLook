import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { supabase } from '../supabaseClient';

const SearchScreen = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      let query = supabase.from('services').select('*');

      if (searchTerm) {
        // Use 'ilike' for case-insensitive search
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (!error) setSearchResults(data);
      setLoading(false);
    };

    fetchServices();
  }, [searchTerm]);

  // Temporarily disable map loading to fix API key warning
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  // });
  const isLoaded = false; // Set to false to prevent map rendering

  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  
  const center = {
    lat: -3.745,
    lng: -38.523
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header with Search and Filters */}
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4 mb-4">
          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="px-4 py-2 border rounded-full">Filters</button>
          <button onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')} className="px-4 py-2 border rounded-full">
            {viewMode === 'list' ? 'Map' : 'List'}
          </button>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {/* Category Chips */}
            <button className="px-3 py-1 bg-secondary text-accent rounded-full text-sm">All</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Nails</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Massage</button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">Facials</button>
        </div>
      </header>

      <main className="p-4 sm:p-6 md:p-8">
        {viewMode === 'list' ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading text-accent">Results</h2>
              {/* Sorting Options */}
              <select className="border rounded-full px-3 py-1">
                <option>Sort by: Relevance</option>
                <option>Sort by: Price</option>
                <option>Sort by: Rating</option>
              </select>
            </div>
            {loading ? <p>Searching for services...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)] bg-secondary rounded-lg">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
              >
                {/* Markers for beauticians can be added here */}
              </GoogleMap>
            ) : <p className="text-accent text-center p-8">Loading map...</p>}
          </div>
        )}

        {/* No results state */}
        {searchResults.length === 0 && (
            <div className="text-center py-16">
                <h3 className="text-xl font-heading text-accent">No results found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
        )}

      </main>
    </div>
  );
};

export default SearchScreen;
