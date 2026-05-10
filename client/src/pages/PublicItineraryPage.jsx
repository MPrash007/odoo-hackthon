import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Calendar, MapPin, Copy, Sparkles, ArrowLeft, User } from 'lucide-react';
import { tripService } from '../services/tripService';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateRange } from '../utils/formatDate';
import toast from 'react-hot-toast';

const PublicItineraryPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getPublicTrip(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
          <Globe style={{ width: '40px', height: '40px', color: '#475569', margin: '0 auto 14px' }} />
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>Trip not found or not public.</p>
        </div>
      </div>
    );
  }

  const { trip, itinerary } = data;
  const actDotColors = { hotel: '#a78bfa', flight: '#60a5fa', food: '#fbbf24', transport: '#34d399', activity: '#22D3EE', sightseeing: '#f472b6' };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Top nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(5, 8, 22, 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px', textDecoration: 'none' }}>
            <ArrowLeft style={{ width: '15px', height: '15px' }} /> Back
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Globe style={{ width: '17px', height: '17px', color: 'white' }} />
            </div>
            <span className="font-display animate-gradient-text" style={{ fontSize: '17px', fontWeight: 800 }}>Traveloop</span>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
          <span className="eyebrow"><Sparkles style={{ width: '11px', height: '11px' }} /> Shared journey</span>
          <h1 className="font-display" style={{
            fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: '800',
            color: '#f1f5f9', marginTop: '10px', marginBottom: '14px',
            letterSpacing: '-0.03em', lineHeight: 1.05,
          }}>
            {trip.title}
          </h1>
          <p style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px' }}>
            <Calendar style={{ width: '15px', height: '15px', color: '#22D3EE' }} />
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>

          {trip.destinations?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {trip.destinations.map(d => (
                <span key={d} style={{
                  padding: '6px 14px', borderRadius: '999px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(139,92,246,0.10))',
                  color: '#22D3EE',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  fontSize: '12px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <MapPin style={{ width: '12px', height: '12px' }} /> {d}
                </span>
              ))}
            </div>
          )}

          {trip.description && (
            <p style={{ color: '#cbd5e1', maxWidth: '580px', margin: '20px auto 0', fontSize: '14px', lineHeight: 1.65 }}>
              {trip.description}
            </p>
          )}

          {trip.user && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '8px 16px', borderRadius: '999px', marginTop: '18px',
              background: 'rgba(148, 163, 184, 0.06)', border: '1px solid rgba(148, 163, 184, 0.10)',
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: 'white',
              }}>
                {trip.user.firstName?.[0]}{trip.user.lastName?.[0]}
              </div>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                Curated by <strong style={{ color: '#f1f5f9' }}>{trip.user.firstName} {trip.user.lastName}</strong>
              </span>
            </div>
          )}
        </motion.div>

        {/* Itinerary */}
        {itinerary?.sections?.map((section, idx) => (
          <motion.div key={idx}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
            className="glass" style={{ padding: '24px', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '20px', bottom: '20px', left: 0, width: '3px',
              borderRadius: '0 4px 4px 0',
              background: 'linear-gradient(180deg, #22D3EE, #8B5CF6)',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.40)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', borderRadius: '9px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
                color: '#22D3EE', fontWeight: 700, fontSize: '12px',
                border: '1px solid rgba(6, 182, 212, 0.20)',
              }}>{idx + 1}</span>
              <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.01em' }}>{section.title}</h3>
            </div>
            {section.description && <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.55 }}>{section.description}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {section.activities?.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 16px', borderRadius: '11px',
                  background: 'rgba(15, 19, 36, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: actDotColors[a.type] || '#22D3EE',
                      boxShadow: `0 0 10px ${actDotColors[a.type] || '#22D3EE'}`,
                    }} />
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{a.name}</span>
                    <span style={{
                      fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em',
                      background: 'rgba(148, 163, 184, 0.06)', padding: '2px 7px', borderRadius: '5px',
                    }}>{a.type}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#22D3EE' }}>₹{a.cost || 0}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <div style={{ textAlign: 'center' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={async () => { 
              try {
                const toastId = toast.loading('Copying trip...');
                const newTrip = await tripService.copyTrip(id);
                toast.success('Trip copied successfully!', { id: toastId });
                // Redirect user to the newly copied trip's dashboard
                window.location.href = `/trips/${newTrip._id}`;
              } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to copy trip. Please login first.');
              }
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 28px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
              color: 'white', fontWeight: '700', fontSize: '14px',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 12px 32px -6px rgba(6, 182, 212, 0.50)',
            }}>
            <Copy style={{ width: '15px', height: '15px' }} /> Copy This Trip
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PublicItineraryPage;
