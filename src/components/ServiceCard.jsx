import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">        
        <img src={`https://images.unsplash.com/photo-1519709442222-3c4063453a2a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60&h=400?seed=${service.id}`} alt={service.name} className="h-40 w-full object-cover" />
        <div className="p-4">
          <h3 className="font-bold text-lg text-accent mb-1">{service.name}</h3>
          <p className="text-sm text-gray-500">{service.duration} | <span className="font-bold text-primary">${service.price}</span></p>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
