import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, TrendingUp, Plane, ChevronRight, Sparkles, Calendar, Globe, Wallet, Compass } from 'lucide-react';
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

  if (loading) return <LoadingSpinner />;

  const upcomingTrips = trips.filter(t => t.status === 'upcoming').length;
  const ongoingTrips = trips.filter(t => t.status === 'ongoing').length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const totalBudget = trips.reduce((sum, t) => sum + (t.totalBudget || 0), 0);

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Plane, color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.10)', border: 'rgba(34, 211, 238, 0.20)' },
    { label: 'Upcoming', value: upcomingTrips, icon: Calendar, color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.10)', border: 'rgba(96, 165, 250, 0.20)' },
    { label: 'Cities Available', value: cities.length, icon: Globe, color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.10)', border: 'rgba(167, 139, 250, 0.20)' },
    { label: 'Total Budget', value: `₹${totalBudget.toLocaleString()}`, icon: Wallet, color: '#F472B6', bg: 'rgba(244, 114, 182, 0.10)', border: 'rgba(244, 114, 182, 0.20)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px' }}
    >
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="bg-mesh-aurora noise"
        style={{
          position: 'relative', borderRadius: '28px', overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.10)',
          boxShadow: '0 24px 80px -16px rgba(6, 182, 212, 0.20), 0 0 0 1px rgba(139, 92, 246, 0.05)',
        }}
      >
        {/* Animated orbs */}
        <div className="animate-float-slow" style={{ position: 'absolute', top: '-60px', right: '10%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.20), transparent 70%)' }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '-80px', left: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%)', animationDelay: '1s' }} />

        <div style={{ position: 'relative', padding: 'clamp(32px, 5vw, 56px) clamp(24px, 4vw, 48px)', display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 480px', maxWidth: '640px' }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="eyebrow"
            >
              <Sparkles style={{ width: '12px', height: '12px' }} /> Welcome back, {user?.firstName || 'Explorer'}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-display"
              style={{
                fontSize: 'clamp(34px, 5vw, 54px)', fontWeight: '800', letterSpacing: '-0.03em',
                lineHeight: 1.05, marginTop: '14px', marginBottom: '16px',
              }}
            >
              <span style={{ color: '#f1f5f9' }}>Plan your </span>
              <span className="text-gradient">next adventure</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.65, maxWidth: '520px', marginBottom: '28px' }}
            >
              Build multi-city itineraries, track budgets, and share unforgettable journeys with the world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/trips/new')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '14px 26px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                  color: 'white', fontWeight: '700', fontSize: '14px',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 12px 32px -6px rgba(6, 182, 212, 0.50), 0 6px 16px -4px rgba(139, 92, 246, 0.30)',
                }}
              >
                <Plane style={{ width: '17px', height: '17px' }} /> Plan a Trip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/search')}
                className="btn-ghost"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 22px', borderRadius: '14px' }}
              >
                <Compass style={{ width: '16px', height: '16px' }} /> Discover Cities
              </motion.button>
            </motion.div>
          </div>

          {/* Decorative globe stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}
            className="hidden md:flex"
            style={{ position: 'relative', width: '220px', height: '220px', flexShrink: 0 }}
          >
            <div className="animate-spin-slow" style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px dashed rgba(6, 182, 212, 0.30)',
            }} />
            <div className="animate-spin-slow" style={{
              position: 'absolute', inset: '20px', borderRadius: '50%',
              border: '1px dashed rgba(139, 92, 246, 0.30)',
              animationDirection: 'reverse', animationDuration: '15s',
            }} />
            <div style={{
              position: 'absolute', inset: '40px', borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #22D3EE, #8B5CF6 70%, #1a0f2e)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.45), inset -20px -20px 60px rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Globe style={{ width: '60px', height: '60px', color: 'white', opacity: 0.85 }} />
            </div>
            {/* Orbiting dot */}
            <div className="animate-spin-slow" style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              animationDuration: '8s',
            }}>
              <div style={{
                position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)',
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#22D3EE', boxShadow: '0 0 14px rgba(34, 211, 238, 1)',
              }} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass card-hover"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{
                width: '46px', height: '46px', borderRadius: '12px',
                background: s.bg, border: `1px solid ${s.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 24px ${s.bg}`,
              }}>
                <Icon style={{ width: '20px', height: '20px', color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
                <p className="font-display" style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', marginTop: '2px', letterSpacing: '-0.02em' }}>{s.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ position: 'relative' }}
      >
        <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b', pointerEvents: 'none' }} />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '50px', padding: '16px 18px 16px 50px', borderRadius: '16px', fontSize: '14px', background: 'rgba(15, 19, 36, 0.55)' }}
          placeholder="Search your trips, destinations…" />
        <span style={{
          position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
          padding: '3px 8px', borderRadius: '6px',
          background: 'rgba(148, 163, 184, 0.08)', border: '1px solid rgba(148, 163, 184, 0.12)',
          fontSize: '10px', color: '#64748b', fontFamily: 'monospace',
        }}>
          ⌘ K
        </span>
      </motion.div>

      {/* TOP DESTINATIONS */}
      {cities.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <span className="eyebrow"><TrendingUp style={{ width: '11px', height: '11px' }} /> Trending</span>
              <h2 className="section-header" style={{ marginTop: '6px' }}>Top destinations</h2>
            </div>
            <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/search')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#22D3EE', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View All <ChevronRight style={{ width: '15px', height: '15px' }} />
            </motion.button>
          </div>
          <div style={{ display: 'flex', gap: '18px', overflowX: 'auto', paddingBottom: '12px', margin: '0 -4px', padding: '0 4px 12px' }} className="scrollbar-hide">
            {cities.slice(0, 8).map((city, i) => (
              <motion.div key={city._id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04, y: -8 }}
                onClick={() => navigate(`/search?city=${city._id}`)}
                style={{
                  flexShrink: 0, width: '200px', cursor: 'pointer', borderRadius: '18px', overflow: 'hidden',
                  border: '1px solid rgba(148,163,184,0.10)',
                  background: 'linear-gradient(160deg, rgba(31, 42, 68, 0.50), rgba(10, 14, 28, 0.85))',
                  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.40)',
                }}
                className="card-hover group"
              >
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img src={city.coverImage} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} className="group-hover:scale-110" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 12, 28, 0.95), transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                    <p className="font-display" style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '15px', letterSpacing: '-0.01em' }}>{city.name}</p>
                    <p style={{ color: '#94a3b8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                      <MapPin style={{ width: '10px', height: '10px' }} /> {city.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* YOUR TRIPS */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <span className="eyebrow"><Plane style={{ width: '11px', height: '11px' }} /> Your library</span>
            <h2 className="section-header" style={{ marginTop: '6px' }}>Your trips</h2>
          </div>
          {trips.length > 0 && (
            <motion.button whileHover={{ x: 3 }} onClick={() => navigate('/trips')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#22D3EE', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              View All <ChevronRight style={{ width: '15px', height: '15px' }} />
            </motion.button>
          )}
        </div>
        {trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{ textAlign: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}
          >
            <div className="animate-float-slow" style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.10), transparent 70%)' }} />
            <div style={{ position: 'relative' }}>
              <div className="animate-float" style={{
                width: '72px', height: '72px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(139, 92, 246, 0.10))',
                border: '1px solid rgba(6, 182, 212, 0.20)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Plane style={{ width: '32px', height: '32px', color: '#22D3EE' }} />
              </div>
              <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>No trips yet</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>Start planning your first adventure today!</p>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/trips/new')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                  color: 'white', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 24px -4px rgba(6, 182, 212, 0.40)',
                }}>
                <Plus style={{ width: '15px', height: '15px' }} /> Create Your First Trip
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {trips.filter(t => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6).map((trip, i) => (
              <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <TripCard trip={trip} onView={id => navigate(`/trips/${id}/itinerary`)} onEdit={id => navigate(`/trips/${id}/build`)} onDelete={handleDeleteTrip} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.12, rotate: 90 }} whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/trips/new')}
        style={{
          position: 'fixed', bottom: '32px', right: '32px',
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', zIndex: 50,
        }}
        className="animate-pulse-glow"
      >
        <Plus style={{ width: '26px', height: '26px', color: 'white' }} />
      </motion.button>
    </motion.div>
  );
};

export default DashboardPage;
