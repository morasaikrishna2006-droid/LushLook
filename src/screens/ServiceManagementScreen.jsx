import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg text-accent">{service.name}</h3>
        <p className="text-sm text-gray-600">{service.category} • {service.duration} • ${service.price}</p>
        <p className={`text-xs font-medium ${service.is_active !== false ? 'text-green-600' : 'text-red-600'}`}>
          {service.is_active !== false ? 'Active' : 'Inactive'}
        </p>
      </div>
      <div className="flex space-x-2">
        <Link to={`/beautician/service/${service.id}`} className="btn btn-sm btn-outline">Edit</Link>
        <button className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
};

const ServiceManagementScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Nails', 'Massage', 'Facials', 'Hair']; // Example categories

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('beautician_id', user.id);

        if (!error) {
          setServices(data);
        }
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, services]);

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Manage Services</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Link to="/beautician/service/new" className="btn btn-primary ml-4 flex-shrink-0">
          + Add New Service
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === category ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? <p>Loading your services...</p> :
          filteredServices.length > 0 ? (
            filteredServices.map(service => <ServiceCard key={service.id} service={service} />)
          ) : (
            <p className="text-center text-gray-500 py-8">No services found. {activeCategory === 'All' && <Link to="/beautician/service/new" className="text-primary underline">Add your first service!</Link>}</p>
          )
        }
      </div>
    </div>
  );
};

export default ServiceManagementScreen;