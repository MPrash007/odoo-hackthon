import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Plus, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getTrips().then(setTrips).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const ongoing = trips.filter(t => t.status === 'ongoing');
  const upcoming = trips.filter(t => t.status === 'upcoming');
  const recentTrips = trips.slice(0, 4);

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Map, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.06)', border: 'rgba(37, 99, 235, 0.15)' },
    { label: 'Ongoing', value: ongoing.length, icon: TrendingUp, color: '#059669', bg: 'rgba(5, 150, 105, 0.06)', border: 'rgba(5, 150, 105, 0.15)' },
    { label: 'Upcoming', value: upcoming.length, icon: Calendar, color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.06)', border: 'rgba(124, 58, 237, 0.15)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Welcome header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="eyebrow">
            <Sparkles style={{ width: '12px', height: '12px' }} /> Dashboard
          </span>
          <h1 className="font-display" style={{
            fontSize: '32px', fontWeight: '700', color: '#111827',
            marginTop: '8px', letterSpacing: '-0.02em',
          }}>
            Welcome back, <span className="text-gradient">{user?.firstName || 'Traveler'}</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginTop: '6px' }}>
            Here's an overview of your travel plans.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/trips/new')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '14px',
            background: '#2563EB', color: 'white',
            fontSize: '14px', fontWeight: '600',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.25)',
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} /> New Trip
        </motion.button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '22px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(17, 24, 39, 0.04)',
              }}
              className="card-hover"
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: s.bg, border: `1px solid ${s.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon style={{ width: '20px', height: '20px', color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.label}
                </p>
                <p className="font-display" style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>
                  {s.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick AI Planner CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 28px', borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(6, 182, 212, 0.06))',
          border: '1px solid rgba(124, 58, 237, 0.12)',
          flexWrap: 'wrap', gap: '16px',
        }}
      >
        <div>
          <h3 className="font-display" style={{ fontSize: '17px', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#7C3AED' }} />
            AI Trip Planner
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            Let AI generate a personalized itinerary in seconds
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/ai-planner')}
          style={{
            padding: '10px 20px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
            color: 'white', fontSize: '13px', fontWeight: '600',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(124, 58, 237, 0.25)',
          }}
        >
          Try AI Planner →
        </motion.button>
      </motion.div>

      {/* Recent Trips */}
      {recentTrips.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h2 className="font-display" style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>
              Recent Trips
            </h2>
            <button onClick={() => navigate('/trips')}
              style={{
                fontSize: '13px', fontWeight: 600, color: '#2563EB',
                background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {recentTrips.map((trip, i) => (
              <motion.div key={trip._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <TripCard
                  trip={trip}
                  onView={id => navigate(`/trips/${id}/itinerary`)}
                  onEdit={id => navigate(`/trips/${id}/build`)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {trips.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center', padding: '80px 20px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
          }}
        >
          <div className="animate-float" style={{
            width: '70px', height: '70px', borderRadius: '20px',
            background: 'rgba(37, 99, 235, 0.06)',
            border: '1px solid rgba(37, 99, 235, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <Map style={{ width: '32px', height: '32px', color: '#2563EB' }} />
          </div>
          <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
            No trips yet
          </h3>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '22px' }}>
            Create your first trip and start planning your adventure!
          </p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/trips/new')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '14px',
              background: '#2563EB', color: 'white',
              fontSize: '14px', fontWeight: '600',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} /> Create First Trip
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
