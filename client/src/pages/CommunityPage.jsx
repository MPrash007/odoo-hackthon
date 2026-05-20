import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Globe, Eye, Heart, Sparkles, MapPin, Calendar, MessageCircle } from 'lucide-react';
import { tripService } from '../services/tripService';
import { formatDateRange } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentModalData, setPaymentModalData] = useState(null);

  useEffect(() => {
    tripService.getPublicTrips()
      .then(data => setTrips(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const handleLike = async (tripId) => {
    if (!user) return; // Optional: Could show a toast saying "please login to like"
    try {
      const data = await tripService.toggleLike(tripId);
      setTrips(trips.map(t => t._id === tripId ? { ...t, likes: data.likes } : t));
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const filteredTrips = trips.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>

      {/* Hero Card */}
      <div className="gradient-border noise" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>
        <div className="animate-float-slow" style={{ position: 'absolute', top: '-60px', right: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.20), transparent 70%)' }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18), transparent 70%)', animationDelay: '1s' }} />

        <div style={{ position: 'relative', padding: '48px 32px', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #A78BFA, #EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 12px 36px rgba(167, 139, 250, 0.40)',
            }}>
            <Users style={{ width: '30px', height: '30px', color: 'white' }} />
          </motion.div>
          <span className="eyebrow" style={{ color: '#F472B6' }}>
            <Sparkles style={{ width: '11px', height: '11px' }} /> Inspiration hub
          </span>
          <h1 className="font-display" style={{
            fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', color: '#f1f5f9',
            marginTop: '10px', marginBottom: '12px', letterSpacing: '-0.03em',
          }}>
            <span className="text-gradient-warm">Community</span> trips
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
            Browse itineraries shared by fellow explorers. Get inspired, copy a trip, and start your own adventure.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b', pointerEvents: 'none' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input-field"
          style={{ paddingLeft: '50px', padding: '16px 18px 16px 50px', borderRadius: '16px' }}
          placeholder="Search community trips..." />
      </div>

      {/* Trip Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {filteredTrips.length > 0 ? filteredTrips.map((trip, i) => (
          <motion.div
            key={trip._id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            style={{
              borderRadius: '20px', overflow: 'hidden',
              background: 'linear-gradient(160deg, rgba(31, 42, 68, 0.55), rgba(10, 14, 28, 0.85))',
              border: '1px solid rgba(148,163,184,0.10)',
              transition: 'all 0.3s',
            }}
            className="card-hover"
          >
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              <div style={{ width: '220px', minHeight: '180px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                  alt={trip.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(15,23,42,0.85) 100%)' }} />
              </div>

              <div style={{ flex: 1, minWidth: '260px', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                <div>
                  <h3 className="font-display" style={{
                    fontSize: '19px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.01em',
                  }}>{trip.title}</h3>
                  {trip.user && (
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                      by {trip.user.firstName} {trip.user.lastName}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar style={{ width: '12px', height: '12px', color: '#22D3EE' }} />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                  {trip.destinations?.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin style={{ width: '12px', height: '12px', color: '#A78BFA' }} />
                      {trip.destinations.join(', ')}
                    </span>
                  )}
                </div>
                {trip.description && (
                  <p style={{
                    fontSize: '13px', color: '#94a3b8', lineHeight: 1.55,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {trip.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/public/${trip._id}`)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '11px', fontSize: '12px', fontWeight: '600',
                      background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))',
                      color: '#22D3EE',
                      border: '1px solid rgba(6,182,212,0.25)', cursor: 'pointer',
                    }}>
                    <Eye style={{ width: '13px', height: '13px' }} /> View Itinerary
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }}
                    onClick={() => handleLike(trip._id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '11px', fontSize: '12px', fontWeight: '600',
                      background: (trip.likes || []).includes(user?._id) ? 'rgba(244, 114, 182, 0.15)' : 'rgba(244, 114, 182, 0.06)',
                      color: (trip.likes || []).includes(user?._id) ? '#F472B6' : '#94a3b8',
                      border: '1px solid rgba(244, 114, 182, 0.15)', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F472B6'; e.currentTarget.style.background = 'rgba(244, 114, 182, 0.15)'; }}
                    onMouseLeave={e => { 
                      e.currentTarget.style.color = (trip.likes || []).includes(user?._id) ? '#F472B6' : '#94a3b8'; 
                      e.currentTarget.style.background = (trip.likes || []).includes(user?._id) ? 'rgba(244, 114, 182, 0.15)' : 'rgba(244, 114, 182, 0.06)'; 
                    }}>
                    <Heart style={{ width: '13px', height: '13px', fill: (trip.likes || []).includes(user?._id) ? 'currentColor' : 'none' }} /> 
                    {trip.likes?.length || 0} {(trip.likes?.length === 1) ? 'Like' : 'Likes'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="glass" style={{ textAlign: 'center', padding: '70px 20px' }}>
            <div className="animate-float" style={{
              width: '70px', height: '70px', borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.10), rgba(236, 72, 153, 0.10))',
              border: '1px solid rgba(168, 85, 247, 0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <Globe style={{ width: '32px', height: '32px', color: '#A78BFA' }} />
            </div>
            <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>No public trips yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '22px' }}>
              Make your trips public to share them with the community!
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/trips')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 22px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                background: 'linear-gradient(135deg, #A78BFA, #EC4899)',
                color: 'white', border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 24px -4px rgba(167, 139, 250, 0.40)',
              }}>
              Go to My Trips
            </motion.button>
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={!!paymentModalData} 
        onClose={() => setPaymentModalData(null)} 
        trip={paymentModalData} 
      />
    </motion.div>
  );
};

export default CommunityPage;
