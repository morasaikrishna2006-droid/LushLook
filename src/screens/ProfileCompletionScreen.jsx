import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProfileCompletionScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // This is a placeholder for the profile completion form
  const handleProfileCompletion = () => {
    setLoading(true);
    // In a real app, you would collect more user data here and save it to the database
    setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
    }, 1000)
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-heading text-accent mb-4">Complete Your Profile</h2>
        <p className="text-gray-600 mb-6">A few more details and you'll be all set.</p>
        
        {/* Placeholder for profile form */}
        <div className="h-48 bg-secondary rounded-lg flex items-center justify-center mb-6">
            <p className="text-accent">Profile completion form will go here.</p>
        </div>

        <button 
            onClick={handleProfileCompletion}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-bold disabled:bg-pink-300"
        >
            {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </div>
    </div>
  );
};

export default ProfileCompletionScreen;
