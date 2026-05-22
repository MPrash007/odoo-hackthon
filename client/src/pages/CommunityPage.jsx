import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Globe, Eye, Heart, Sparkles, MapPin, Calendar } from 'lucide-react';
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
    if (!user) return;
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
      <div style={{
        position: 'relative', overflow: 'hidden', borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(236, 72, 153, 0.08))',
        border: '1px solid #E2E8F0',
      }}>
        <div className="animate-float-slow" style={{ position: 'absolute', top: '-60px', right: '-40px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%)' }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent 70%)', animationDelay: '1s' }} />

        <div style={{ position: 'relative', padding: '48px 32px', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            style={{
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)',
            }}>
            <Users style={{ width: '30px', height: '30px', color: 'white' }} />
          </motion.div>
          <span className="eyebrow" style={{ color: '#EC4899' }}>
            <Sparkles style={{ width: '11px', height: '11px' }} /> Inspiration hub
          </span>
          <h1 className="font-display" style={{
            fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', color: '#111827',
            marginTop: '10px', marginBottom: '12px', letterSpacing: '-0.03em',
          }}>
            <span className="text-gradient-warm">Community</span> trips
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.65, maxWidth: '500px', margin: '0 auto' }}>
            Browse itineraries shared by fellow explorers. Get inspired, copy a trip, and start your own adventure.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748B', pointerEvents: 'none' }} />
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
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(17,24,39,0.04)',
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.95) 100%)' }} />
              </div>

              <div style={{ flex: 1, minWidth: '260px', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                <div>
                  <h3 className="font-display" style={{
                    fontSize: '19px', fontWeight: '700', color: '#111827', letterSpacing: '-0.01em',
                  }}>{trip.title}</h3>
                  {trip.user && (
                    <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginTop: '2px', fontWeight: 500 }}>
                      by {trip.user.firstName} {trip.user.lastName}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#64748B' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Calendar style={{ width: '13px', height: '13px', color: '#2563EB' }} />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </span>
                  {trip.destinations?.length > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#7C3AED' }} />
                      {trip.destinations.join(', ')}
                    </span>
                  )}
                </div>
                {trip.description && (
                  <p style={{
                    fontSize: '13px', color: '#475569', lineHeight: 1.55,
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
                      background: 'rgba(37, 99, 235, 0.06)',
                      color: '#2563EB',
                      border: '1px solid rgba(37, 99, 235, 0.15)', cursor: 'pointer',
                    }}>
                    <Eye style={{ width: '13px', height: '13px' }} /> View Itinerary
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.04 }}
                    onClick={() => handleLike(trip._id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '11px', fontSize: '12px', fontWeight: '600',
                      background: (trip.likes || []).includes(user?._id) ? 'rgba(236, 72, 153, 0.12)' : 'rgba(100, 116, 139, 0.06)',
                      color: (trip.likes || []).includes(user?._id) ? '#EC4899' : '#64748B',
                      border: `1px solid ${(trip.likes || []).includes(user?._id) ? 'rgba(236, 72, 153, 0.20)' : 'rgba(100, 116, 139, 0.12)'}`, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    <Heart style={{ width: '13px', height: '13px', fill: (trip.likes || []).includes(user?._id) ? 'currentColor' : 'none' }} /> 
                    {trip.likes?.length || 0} {(trip.likes?.length === 1) ? 'Like' : 'Likes'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div className="animate-float" style={{
              width: '70px', height: '70px', borderRadius: '20px',
              background: 'rgba(124, 58, 237, 0.06)',
              border: '1px solid rgba(124, 58, 237, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px',
            }}>
              <Globe style={{ width: '32px', height: '32px', color: '#7C3AED' }} />
            </div>
            <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>No public trips yet</h3>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '22px' }}>
              Make your trips public to share them with the community!
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/trips')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '11px 22px', borderRadius: '12px', fontSize: '13px', fontWeight: '600',
                background: '#2563EB',
                color: 'white', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.20)',
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
