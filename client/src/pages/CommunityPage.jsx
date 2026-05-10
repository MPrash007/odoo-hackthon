import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Globe, Eye, Heart } from 'lucide-react';
import { tripService } from '../services/tripService';
import { formatDateRange } from '../utils/formatDate';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    tripService.getTrips()
      .then(data => setTrips(data.filter(t => t.isPublic)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const filteredTrips = trips.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>

      {/* Hero Card */}
      <div style={{
        borderRadius: '20px', padding: '40px 32px', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.6))',
        border: '1px solid rgba(148,163,184,0.1)',
        backdropFilter: 'blur(16px)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 30px rgba(168, 85, 247, 0.3)',
          }}>
            <Users style={{ width: '26px', height: '26px', color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#f1f5f9', marginBottom: '10px' }}>Community</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
            Share your travel experiences and discover itineraries from fellow explorers around the world.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b', pointerEvents: 'none' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          className="input-field"
          style={{ paddingLeft: '48px', padding: '14px 16px 14px 48px', borderRadius: '14px', fontSize: '14px' }}
          placeholder="Search community trips..."
        />
      </div>

      {/* Trip Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTrips.length > 0 ? filteredTrips.map((trip, i) => (
          <motion.div
            key={trip._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              borderRadius: '18px', overflow: 'hidden',
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              border: '1px solid rgba(148,163,184,0.1)',
              transition: 'all 0.3s',
            }}
            className="card-hover"
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {/* Image */}
              <div style={{ width: '200px', minHeight: '160px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                  alt={trip.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(15,23,42,0.8) 100%)' }} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>{trip.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  {formatDateRange(trip.startDate, trip.endDate)}
                  {trip.destinations?.length > 0 && ` · ${trip.destinations.join(', ')}`}
                </p>
                {trip.description && (
                  <p style={{
                    fontSize: '13px', color: '#475569', lineHeight: '1.5',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {trip.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <button
                    onClick={() => navigate(`/public/${trip._id}`)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
                      background: 'rgba(6,182,212,0.12)', color: '#22D3EE',
                      border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Eye style={{ width: '13px', height: '13px' }} /> View Itinerary
                  </button>
                  <button
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
                      background: 'rgba(148,163,184,0.06)', color: '#94a3b8',
                      border: '1px solid rgba(148,163,184,0.1)', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Heart style={{ width: '13px', height: '13px' }} /> Like
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : (
          /* Empty State */
          <div style={{
            textAlign: 'center', padding: '60px 20px', borderRadius: '20px',
            background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.08)',
          }}>
            <Globe style={{ width: '48px', height: '48px', color: '#334155', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>No public trips yet</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
              Make your trips public to share with the community!
            </p>
            <button
              onClick={() => navigate('/trips')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 22px', borderRadius: '12px', fontSize: '13px', fontWeight: '500',
                background: 'rgba(6,182,212,0.12)', color: '#22D3EE',
                border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer',
              }}
            >
              Go to My Trips
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommunityPage;
