import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Sample Data - In a real app, this would come from an API
const sampleServices = [
  {
    id: '1',
    name: 'Classic Manicure',
    category: 'Nails',
    price: 45,
    duration: '60 min',
    description: 'A classic manicure to keep your nails looking their best. Includes shaping, cuticle care, a relaxing hand massage, and a polish of your choice.',
    images: ['/placeholder.svg'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Deep Tissue Massage',
    category: 'Massage',
    price: 120,
    duration: '90 min',
    description: 'Relieve tension and soothe sore muscles with our deep tissue massage.',
    images: ['/placeholder.svg'],
    isActive: false,
  },
];

const AddEditServiceScreen = () => {
  const { id } = useParams(); // Will be 'new' or a service ID
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); // Array of image URLs or File objects
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch service details by ID
      const serviceToEdit = sampleServices.find(s => s.id === id);
      if (serviceToEdit) {
        setServiceName(serviceToEdit.name);
        setCategory(serviceToEdit.category);
        setPrice(serviceToEdit.price);
        setDuration(serviceToEdit.duration);
        setDescription(serviceToEdit.description);
        setImages(serviceToEdit.images);
        setIsActive(serviceToEdit.isActive);
      } else {
        setError('Service not found.');
      }
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In a real app, send data to your API
    const serviceData = {
      name: serviceName,
      category,
      price: parseFloat(price),
      duration,
      description,
      images, // You'd handle image uploads separately
      isActive,
    };

    console.log(isEditMode ? 'Updating service:' : 'Adding new service:', serviceData);

    setTimeout(() => {
      setLoading(false);
      alert(isEditMode ? 'Service updated successfully!' : 'Service added successfully!');
      navigate('/beautician/services'); // Go back to service management
    }, 1500);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      // In a real app, call API to delete service
      console.log('Deleting service:', id);
      setTimeout(() => {
        setLoading(false);
        alert('Service deleted successfully!');
        navigate('/beautician/services');
      }, 1000);
    }
  };

  if (error && isEditMode) {
    return <div className="bg-background min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
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
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (e.g., 60 min)</label>
            <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
          {images.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {images.map((img, index) => (
                <img key={index} src={img} alt="Service" className="w-16 h-16 object-cover rounded-md" />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active (Visible to customers)</label>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
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