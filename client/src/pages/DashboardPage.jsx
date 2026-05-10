import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, TrendingUp, Plane, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { activityService } from '../services/activityService';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [tripsData, citiesData] = await Promise.all([tripService.getTrips(), activityService.getCities()]);
        setTrips(tripsData); setCities(citiesData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try { await tripService.deleteTrip(id); setTrips(p => p.filter(t => t._id !== id)); toast.success('Trip deleted'); }
    catch { toast.error('Failed to delete trip'); }
  };

  const heroWords = ['Plan', 'Your', 'Next', 'Adventure'];

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      {/* Hero Banner */}
      <div style={{
        position: 'relative', borderRadius: '24px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0f172a 100%)',
        border: '1px solid rgba(148, 163, 184, 0.08)',
      }}>
        <div style={{ position: 'absolute', top: '20px', right: '40px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10px', left: '30px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'relative', padding: '48px 40px' }}>
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              {heroWords.map((word, i) => (
                <motion.span key={word} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
                  style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', color: i === heroWords.length - 1 ? '#22D3EE' : '#f1f5f9' }}>
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px', maxWidth: '500px' }}>
              Create multi-city itineraries, track budgets, and share your adventures with the world.
            </motion.p>
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/trips/new')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
                color: 'white', fontWeight: '600', fontSize: '14px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(6, 182, 212, 0.35)',
              }}>
              <Plane style={{ width: '16px', height: '16px' }} /> Plan a Trip
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b', pointerEvents: 'none' }} />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field" style={{ paddingLeft: '48px', padding: '14px 16px 14px 48px', borderRadius: '14px', fontSize: '14px' }}
          placeholder="Search your trips, destinations..." />
      </div>

      {/* Top Destinations */}
      {cities.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#06B6D4' }} /> Top Destinations
            </h2>
            <button onClick={() => navigate('/search')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#06B6D4', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All <ChevronRight style={{ width: '15px', height: '15px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }} className="scrollbar-hide">
            {cities.slice(0, 8).map((city, i) => (
              <motion.div key={city._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -6 }}
                onClick={() => navigate(`/search?city=${city._id}`)}
                style={{ flexShrink: 0, width: '180px', cursor: 'pointer', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.08)', background: '#0f172a' }}
                className="card-hover group">
                <div style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
                  <img src={city.coverImage} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-110" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,11,20,0.85), transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
                    <p style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px' }}>{city.name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin style={{ width: '10px', height: '10px' }} /> {city.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Your Trips */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9' }}>Your Trips</h2>
          {trips.length > 0 && (
            <button onClick={() => navigate('/trips')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#06B6D4', background: 'none', border: 'none', cursor: 'pointer' }}>
              View All <ChevronRight style={{ width: '15px', height: '15px' }} />
            </button>
          )}
        </div>
        {trips.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
            <Plane style={{ width: '48px', height: '48px', color: '#334155', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>No trips yet</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Start planning your first adventure!</p>
            <button onClick={() => navigate('/trips/new')} className="btn-secondary">Create Your First Trip</button>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {trips.filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map((trip, i) => (
              <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <TripCard trip={trip} onView={id => navigate(`/trips/${id}/itinerary`)} onEdit={id => navigate(`/trips/${id}/build`)} onDelete={handleDeleteTrip} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/trips/new')}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', width: '56px', height: '56px',
          borderRadius: '50%', background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', zIndex: 50,
          boxShadow: '0 8px 30px rgba(6, 182, 212, 0.4)',
        }}
        className="animate-pulse-glow"
      >
        <Plus style={{ width: '24px', height: '24px', color: 'white' }} />
      </motion.button>
    </motion.div>
  );
};

export default DashboardPage;
