import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      console.error('Error signing in:', error.message);
    } else {
      // On successful login, check the user's role and navigate accordingly
      const userType = data.user?.user_metadata?.user_type;
      if (userType === 'beautician') {
        navigate('/beautician/dashboard');
      } else {
        // Default to customer dashboard
        navigate('/dashboard');
      }
    }
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) {
      setError(error.message);
      console.error(`Error signing in with ${provider}:`, error.message);
      setLoading(false);
    }
    // Supabase handles the redirect, so no need to call navigate() here.
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-heading text-accent text-center mb-6">Welcome Back!</h2>

        {error && <p className="bg-warning text-white text-center p-3 rounded-lg mb-6">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="mr-2" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-bold disabled:bg-pink-300">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <p className="text-center text-gray-500 my-6">or</p>

        {/* Social Logins */}
        <div className="flex items-center justify-center space-x-4">
          <button type="button" aria-label="Sign in with Google" onClick={() => handleOAuthSignIn('google')} disabled={loading} className="p-3 border rounded-full hover:bg-gray-100 disabled:opacity-50">
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.534-11.088-8.264l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.625,44,30.636,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
          </button>
          <button type="button" aria-label="Sign in with Facebook" onClick={() => handleOAuthSignIn('facebook')} disabled={loading} className="p-3 border rounded-full hover:bg-gray-100 disabled:opacity-50">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
            </svg>
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account? 
          <Link to="/register" className="text-primary font-bold"> Create One</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginScreen;
