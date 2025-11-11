import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

// Sample Data - in a real app, you would fetch this based on the :id param
const beauticianDetails = {
  id: 1,
  name: 'Alice Johnson',  
  avatar: 'https://images.unsplash.com/photo-1556229103-71ae7b3c3b75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80',
  specialization: 'Nail Art & Styling',
  rating: 4.8,
  reviewsCount: 45,
  isVerified: true,
  isAvailable: true,
  bio: 'With over 10 years of experience, Alice is a master of creating stunning and long-lasting nail art. She is passionate about using high-quality, non-toxic products to ensure the health and beauty of your nails.',
  services: [
    { id: 1, name: 'Classic Manicure', duration: '60 min', price: '45' },
    { id: 5, name: 'Gel Manicure', duration: '75 min', price: '60' },
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1604654894610-df63bc536374?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80', 
    'https://images.unsplash.com/photo-1633359983302-a376965a9547?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80', 
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1605499333822-65b4a3ce3358?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80'
  ],
  reviews: [
    { id: 1, author: 'Jane Doe', rating: 5, comment: 'Alice was amazing! My nails have never looked better.' },
    { id: 2, author: 'Emily Smith', rating: 4, comment: 'Great service, very professional and clean salon.' },
  ],
};

const BeauticianProfileScreen = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // In a real app, fetch beauticianDetails based on `id`

  return (
    <div className="bg-background min-h-screen">
      <main className="p-4 sm:p-6 md:p-8">
        {/* Header Section */}
        <section className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img src={beauticianDetails.avatar} alt={beauticianDetails.name} className="w-32 h-32 rounded-full object-cover flex-shrink-0" />
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start">
              <h1 className="text-3xl font-heading text-accent">{beauticianDetails.name}</h1>
              {beauticianDetails.isVerified && <span className="ml-2 text-white bg-green-500 text-xs font-bold px-2 py-1 rounded-full">VERIFIED</span>}
            </div>
            <p className="text-gray-600">{beauticianDetails.specialization}</p>
            <div className="flex items-center justify-center sm:justify-start my-2">
              <span className="text-yellow-500">{'★'.repeat(Math.round(beauticianDetails.rating))}</span>
              <span className="ml-2 text-gray-600">{beauticianDetails.rating} ({beauticianDetails.reviewsCount} reviews)</span>
            </div>
            <p className="text-sm text-gray-500">Availability: <span className={beauticianDetails.isAvailable ? 'text-success' : 'text-warning'}>{beauticianDetails.isAvailable ? 'Available' : 'Unavailable'}</span></p>
          </div>
          <div className="sm:ml-auto flex items-center space-x-2">
            <button onClick={() => setIsFavorite(!isFavorite)}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-colors ${isFavorite ? 'text-primary fill-current' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
            </button>
            <button onClick={() => navigate(`/chat/${beauticianDetails.id}`)} className="p-2 border rounded-full hover:bg-gray-100">Message</button>
          </div>
        </section>

        {/* Bio Section */}
        <section className="mb-8">
            <h2 className="text-2xl font-heading text-accent mb-4">About Me</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="font-body text-gray-700">{beauticianDetails.bio}</p>
            </div>
        </section>

        {/* Services Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-heading text-accent mb-4">Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beauticianDetails.services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="mb-8">
            <h2 className="text-2xl font-heading text-accent mb-4">Portfolio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {beauticianDetails.portfolio.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`Portfolio image ${index + 1}`} className="h-40 w-full object-cover rounded-lg" />
                ))}
            </div>
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="text-2xl font-heading text-accent mb-4">Reviews</h2>
          <div className="space-y-4">
            {beauticianDetails.reviews.map(review => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <p className="font-bold text-accent">{review.author}</p>
                  <div className="ml-auto text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BeauticianProfileScreen;
