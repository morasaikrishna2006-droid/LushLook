import { Link } from 'react-router-dom';

const BeauticianProfileCard = ({ beautician }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center transform hover:-translate-y-1 transition-transform duration-300">
      <img src={beautician.avatar_url || 'https://i.pravatar.cc/150?u=' + beautician.id} alt={beautician.name} className="w-24 h-24 rounded-full object-cover mb-4" />
      <h3 className="font-bold text-lg text-accent">{beautician.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{beautician.specialization}</p>
      {/* Placeholder for rating */}
      <p className="text-sm text-yellow-500 mb-4">★★★★☆ ({beautician.reviews} reviews)</p>
      <Link to={`/beautician/${beautician.id}`} className="w-full">
        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-pink-700 transition-colors">View Profile</button>
      </Link>
    </div>
  );
};

export default BeauticianProfileCard;
