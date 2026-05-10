import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import MyTripsPage from './pages/MyTripsPage';
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import ItineraryViewPage from './pages/ItineraryViewPage';
import CitySearchPage from './pages/CitySearchPage';
import BudgetPage from './pages/BudgetPage';
import PackingChecklistPage from './pages/PackingChecklistPage';
import PublicItineraryPage from './pages/PublicItineraryPage';
import UserProfilePage from './pages/UserProfilePage';
import TripNotesPage from './pages/TripNotesPage';
import CommunityPage from './pages/CommunityPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {children}
    </main>
  </>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/public/:id" element={<PublicItineraryPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips" element={<PrivateRoute><AppLayout><MyTripsPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/new" element={<PrivateRoute><AppLayout><CreateTripPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/:id/build" element={<PrivateRoute><AppLayout><ItineraryBuilderPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/:id/itinerary" element={<PrivateRoute><AppLayout><ItineraryViewPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/:id/budget" element={<PrivateRoute><AppLayout><BudgetPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/:id/checklist" element={<PrivateRoute><AppLayout><PackingChecklistPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/:id/notes" element={<PrivateRoute><AppLayout><TripNotesPage /></AppLayout></PrivateRoute>} />
        <Route path="/trips/:id/expense" element={<PrivateRoute><AppLayout><BudgetPage /></AppLayout></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><AppLayout><CitySearchPage /></AppLayout></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><AppLayout><CommunityPage /></AppLayout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><AppLayout><UserProfilePage /></AppLayout></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AppLayout><AdminDashboardPage /></AppLayout></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 19, 36, 0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 500,
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.05)',
          },
          success: { iconTheme: { primary: '#22D3EE', secondary: '#0a0f1f' } },
          error: { iconTheme: { primary: '#F472B6', secondary: '#0a0f1f' } },
        }}
      />
    </AuthProvider>
  );
}

export default App;
