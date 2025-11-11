import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset email sent!');
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-heading text-accent text-center mb-6">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">Enter your email to receive a password reset link.</p>
        {message && <p className="bg-success text-white text-center p-3 rounded-lg mb-6">{message}</p>}
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-300">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6">
          Remembered your password? 
          <Link to="/login" className="text-primary font-bold"> Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
