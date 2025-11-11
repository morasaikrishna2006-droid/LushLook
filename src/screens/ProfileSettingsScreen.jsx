import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Sample Data - In a real app, this would come from an authenticated user context or API

const ProfileSettingsScreen = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    // In a real app, fetch user profile data here
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          setError('Could not fetch profile.');
          console.error(error);
        } else if (data) {
          setProfile(data);
          setFullName(data.full_name || '');
          setEmail(user.email || '');
          setPhone(data.phone || '');
          setLocation(data.location || '');
          setSpecialization(data.specialization || '');
          setBio(data.bio || '');
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Guard against saving when profile hasn't loaded
    if (!profile) {
      setError("Profile data is not loaded yet. Please wait and try again.");
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const updates = {
        id: user.id,
        full_name: fullName,
        phone,
        location,
        specialization: profile.user_type === 'beautician' ? specialization : undefined,
        bio: profile.user_type === 'beautician' ? bio : undefined,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        setError('Failed to update profile.');
      } else {
        setProfile(prev => ({ ...prev, ...updates, full_name: fullName }));
        setSuccess('Profile updated successfully!');
      }
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) {
      setError(error.message);
    }
    // The onAuthStateChange listener in App.jsx will handle navigation.
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      setError('');
      const { error } = await supabase.functions.invoke('delete-user');
      setLoading(false);

      if (error) {
        setError(`Failed to delete account: ${error.message}`);
      } else {
        // The signOut event will be caught by the listener in App.jsx
        alert('Your account has been successfully deleted.');
        // The listener will then redirect to the welcome screen.
      }
    }
  };

  if (loading && !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-heading text-accent mb-6">Profile Settings</h1>

      {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-accent text-3xl font-bold">{fullName.charAt(0) || 'U'}</span>
            )}
          </div>
          <button type="button" className="btn btn-outline">Change Photo</button>
        </div>

        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-heading text-accent mb-3">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            {/* Conditional fields for beauticians */}
            {profile?.user_type === 'beautician' && (
              <>
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input type="text" id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        <div>
          <h2 className="text-xl font-heading text-accent mb-3">Notification Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">Email Notifications</label>
              <input type="checkbox" id="emailNotifications" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <input type="checkbox" id="smsNotifications" checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} className="h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h2 className="text-xl font-heading text-accent mb-3">Account Settings</h2>
          <div className="space-y-3">
            <Link to="/change-password" className="block text-primary hover:underline">Change Password</Link>
            <Link to="/profile/payment-methods" className="block text-primary hover:underline">Payment Methods</Link>
            <button type="button" onClick={handleSignOut} disabled={loading} className="block text-primary hover:underline disabled:text-gray-400">Sign Out</button>
            <button type="button" onClick={handleDeleteAccount} disabled={loading} className="block text-red-500 hover:underline disabled:text-gray-400">Delete Account</button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-8 py-3 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettingsScreen;