import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Map, Plus, Sparkles, LayoutGrid } from 'lucide-react';
import { tripService } from '../services/tripService';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MyTripsPage = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { tripService.getTrips().then(setTrips).finally(() => setLoading(false)); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try { await tripService.deleteTrip(id); setTrips(p => p.filter(t => t._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  const filtered = trips.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const grouped = {
    ongoing: filtered.filter(t => t.status === 'ongoing'),
    upcoming: filtered.filter(t => t.status === 'upcoming'),
    completed: filtered.filter(t => t.status === 'completed'),
  };

  if (loading) return <LoadingSpinner />;

  const statusMeta = {
    ongoing: { dot: '#34d399', label: 'Ongoing', glow: 'rgba(52, 211, 153, 0.40)' },
    upcoming: { dot: '#60a5fa', label: 'Upcoming', glow: 'rgba(96, 165, 250, 0.40)' },
    completed: { dot: '#94a3b8', label: 'Completed', glow: 'rgba(148, 163, 184, 0.30)' },
  };

  const filterPill = (active) => ({
    padding: '8px 16px', borderRadius: '11px', fontSize: '12px', fontWeight: '600',
    textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
    background: active ? 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))' : 'rgba(148,163,184,0.06)',
    color: active ? '#22D3EE' : '#94a3b8',
    border: `1px solid ${active ? 'rgba(6,182,212,0.30)' : 'rgba(148,163,184,0.10)'}`,
    boxShadow: active ? '0 4px 16px rgba(6, 182, 212, 0.18)' : 'none',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="eyebrow"><LayoutGrid style={{ width: '11px', height: '11px' }} /> Library</span>
          <h1 className="font-display" style={{ fontSize: '34px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.03em', marginTop: '6px' }}>
            My <span className="text-gradient">Trips</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '6px' }}>
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'} total · {grouped.ongoing.length} ongoing
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/trips/new')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px', borderRadius: '13px',
            background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
            color: 'white', fontSize: '13px', fontWeight: '700', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px -4px rgba(6, 182, 212, 0.40)',
          }}>
          <Plus style={{ width: '15px', height: '15px' }} /> New Trip
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass" style={{ padding: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field input-with-icon" placeholder="Search trips by title..." />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all','ongoing','upcoming','completed'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={filterPill(filterStatus === s)}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          className="glass"
          style={{ textAlign: 'center', padding: '80px 20px' }}
        >
          <div className="animate-float" style={{
            width: '70px', height: '70px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(139, 92, 246, 0.10))',
            border: '1px solid rgba(6, 182, 212, 0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <Map style={{ width: '32px', height: '32px', color: '#22D3EE' }} />
          </div>
          <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', marginBottom: '8px' }}>No trips found</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Try adjusting your filters or create a new trip.</p>
        </motion.div>
      ) : (
        Object.entries(grouped).map(([status, items]) => items.length > 0 && (
          <section key={status}>
            <h2 style={{
              fontSize: '14px', fontWeight: '700', color: statusMeta[status].dot, marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', letterSpacing: '0.10em',
            }}>
              <span style={{
                width: '9px', height: '9px', borderRadius: '50%',
                background: statusMeta[status].dot,
                boxShadow: `0 0 10px ${statusMeta[status].glow}`,
              }} />
              {statusMeta[status].label} <span style={{ color: '#475569', fontWeight: 500 }}>· {items.length}</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {items.map((trip, i) => (
                <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <TripCard trip={trip} onView={id => navigate(`/trips/${id}/itinerary`)} onEdit={id => navigate(`/trips/${id}/build`)} onDelete={handleDelete} />
                </motion.div>
              ))}
            </div>
          </section>
        ))
      )}
    </motion.div>
  );
};

export default MyTripsPage;
