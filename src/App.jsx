import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import BeauticianLayout from './components/BeauticianLayout';
import { supabase } from './supabaseClient';

// Import all the screens you've defined
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import ProfileCompletionScreen from './screens/ProfileCompletionScreen';

// Customer Screens
import CustomerDashboardScreen from './screens/CustomerDashboardScreen';
import SearchScreen from './screens/SearchScreen';
import ServiceDetailsScreen from './screens/ServiceDetailsScreen';
import BeauticianProfileScreen from './screens/BeauticianProfileScreen';
import BookingScreen from './screens/BookingScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import BookingsScreen from './screens/BookingsScreen';
import BookingDetailsScreen from './screens/BookingDetailsScreen';

// Shared Screens
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileSettingsScreen from './screens/ProfileSettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SupportScreen from './screens/SupportScreen';

// Beautician Screens
import BeauticianDashboardScreen from './screens/BeauticianDashboardScreen';
import ServiceManagementScreen from './screens/ServiceManagementScreen';
import AddEditServiceScreen from './screens/AddEditServiceScreen';
import CalendarManagementScreen from './screens/CalendarManagementScreen';

// A component to protect routes that require a session
const ProtectedRoute = ({ session }) => {
  if (!session) {
    return <Navigate to="/welcome" replace />;
  }
  return <Outlet />; // Renders the child routes
};

// A component to protect routes specific to a user type
const RoleProtectedRoute = ({ session, allowedRoles }) => {
  const userType = session?.user?.user_metadata?.user_type;

  if (!session) {
    return <Navigate to="/welcome" replace />;
  }

  if (!allowedRoles.includes(userType)) {
    // If role doesn't match, redirect to a default dashboard or an unauthorized page
    return <Navigate to={userType === 'beautician' ? '/beautician/dashboard' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

// A component for routes that should only be accessed by logged-out users
const PublicOnlyRoute = ({ session }) => {
  if (session) {
    const userType = session.user?.user_metadata?.user_type;
    const dashboardPath = userType === 'beautician' ? '/beautician/dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }
  return <Outlet />;
};

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Stop loading once the session is fetched
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN') {
        const userType = session.user?.user_metadata?.user_type;
        if (userType === 'beautician') {
          navigate('/beautician/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else if (_event === 'SIGNED_OUT') {
        navigate('/welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show a loading indicator while the initial session is being fetched
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      {/* Routes for logged-out users only */}
      <Route element={<PublicOnlyRoute session={session} />}>
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
      </Route>

      {/* Routes for any logged-in user */}
      <Route element={<ProtectedRoute session={session} />}>
        <Route path="/verify-email" element={<EmailVerificationScreen />} />
        <Route path="/complete-profile" element={<ProfileCompletionScreen />} />
        <Route path="/support" element={<SupportScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/chat/:userId" element={<ChatScreen />} />
      </Route>

      {/* Customer-specific routes */}
      <Route element={<RoleProtectedRoute session={session} allowedRoles={['customer']} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<CustomerDashboardScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/bookings" element={<BookingsScreen />} />
          <Route path="/messages" element={<MessagesScreen />} />
          <Route path="/profile" element={<ProfileSettingsScreen />} />
        </Route>
        <Route path="/service/:id" element={<ServiceDetailsScreen />} />
        <Route path="/beautician/:id" element={<BeauticianProfileScreen />} />
        <Route path="/book/:serviceId" element={<BookingScreen />} />
        <Route path="/booking/:id" element={<BookingDetailsScreen />} />
      </Route>

      {/* Beautician-specific routes */}
      <Route element={<RoleProtectedRoute session={session} allowedRoles={['beautician']} />}>
        <Route element={<BeauticianLayout />}>
          <Route path="/beautician/dashboard" element={<BeauticianDashboardScreen />} />
          <Route path="/beautician/services" element={<ServiceManagementScreen />} />
          <Route path="/beautician/calendar" element={<CalendarManagementScreen />} />
          <Route path="/beautician/profile" element={<ProfileSettingsScreen />} />
        </Route>
        <Route path="/beautician/service/:id" element={<AddEditServiceScreen />} />
      </Route>

      {/* Fallback route for the root path */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

export default App;