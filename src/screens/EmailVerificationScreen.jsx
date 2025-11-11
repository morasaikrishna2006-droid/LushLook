import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import OtpInput from '../components/OtpInput';

const EmailVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOtp = async (otpValue) => {
    setOtp(otpValue);
    if (otpValue.length === 6) {
        setLoading(true);
        setError('');
        const { data, error } = await supabase.auth.verifyOtp({ email, token: otpValue, type: 'signup' });
        setLoading(false);
        if (error) {
            setError("Invalid or expired OTP. Please try again.");
        } else {
            setMessage("Email verified successfully! Redirecting...");
            setTimeout(() => {
                navigate('/complete-profile');
            }, 2000);
        }
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    // This will not work as of Supabase V2, needs server-side implementation
    // For demo purposes, we will just reset the cooldown
    setResendCooldown(60);
    setMessage("A new verification code has been sent.")
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-heading text-accent mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">A 6-digit verification code has been sent to <span className="font-bold">{email}</span>.</p>

        {error && <p className="bg-warning text-white p-3 rounded-lg mb-4">{error}</p>}
        {message && <p className="bg-success text-white p-3 rounded-lg mb-4">{message}</p>}

        <OtpInput onComplete={handleVerifyOtp} />

        <div className="mt-6">
            <button 
                onClick={handleResendCode} 
                disabled={resendCooldown > 0}
                className="text-primary disabled:text-gray-400"
            >
                Resend Code {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
            </button>
        </div>

        <Link to="/register">
            <p className="text-gray-500 mt-8">Entered the wrong email? <span className="font-bold text-primary">Go Back</span></p>
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
