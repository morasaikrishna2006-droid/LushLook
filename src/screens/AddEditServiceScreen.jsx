import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AddEditServiceScreen = () => {
  const { id } = useParams(); // `id` will be present if editing, undefined if adding
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchService = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setError('Could not fetch service to edit.');
        } else if (data) {
          setServiceName(data.name);
          setCategory(data.category || '');
          setPrice(data.price);
          setDuration(data.duration);
          setDescription(data.description);
        }
        setLoading(false);
      };
      fetchService();
    }
  }, [id, isEditMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to save a service.');
      setLoading(false);
      return;
    }

    const serviceData = {
      id: isEditMode ? id : undefined,
      beautician_id: user.id,
      name: serviceName, // Use state variable here
      category,
      price: parseFloat(price),
      duration,
      description,
    };

    const { error: saveError } = await supabase.from('services').upsert(serviceData);

    setLoading(false);
    if (saveError) {
      setError('Failed to save service. Please try again.');
      console.error(saveError);
    } else {
      // On success, navigate back to the service management screen
      navigate('/beautician/services');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      // Add delete logic here in the future
      alert('Delete functionality not yet implemented.');
    }
  };

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      {loading && isEditMode && <p>Loading service data...</p>}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
          <input type="text" id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select a category</option>
            <option value="Nails">Nails</option>
            <option value="Massage">Massage</option>
            <option value="Facials">Facials</option>
            <option value="Hair">Hair</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" id="price" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 60 min)</label>
            <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 60 min" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
          <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
            <p className="text-gray-500">Image Upload Area (Placeholder)</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Link to="/beautician/services" className="btn btn-outline">Cancel</Link>
          {isEditMode && (
            <button type="button" onClick={handleDelete} disabled={loading} className="btn btn-outline border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50">
              Delete Service
            </button>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditServiceScreen;