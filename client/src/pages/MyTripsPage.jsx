import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Map } from 'lucide-react';
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

  const grouped = { ongoing: filtered.filter(t => t.status === 'ongoing'), upcoming: filtered.filter(t => t.status === 'upcoming'), completed: filtered.filter(t => t.status === 'completed') };

  if (loading) return <LoadingSpinner />;

  const statusDot = { ongoing: '#34d399', upcoming: '#60a5fa', completed: '#64748b' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>My Trips</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/trips/new')}
          style={{ padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #0891B2, #06B6D4)', color: 'white', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(6,182,212,0.3)' }}>
          + New Trip
        </motion.button>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field input-with-icon" placeholder="Search trips..." />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['all','ongoing','upcoming','completed'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
                textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s',
                background: filterStatus === s ? 'rgba(6,182,212,0.15)' : 'rgba(148,163,184,0.06)',
                color: filterStatus === s ? '#22D3EE' : '#94a3b8',
                border: `1px solid ${filterStatus === s ? 'rgba(6,182,212,0.3)' : 'rgba(148,163,184,0.1)'}`,
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', borderRadius: '20px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.08)' }}>
          <Map style={{ width: '48px', height: '48px', color: '#334155', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>No trips found</h3>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Try adjusting your filters or create a new trip.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([status, items]) => items.length > 0 && (
          <section key={status}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: statusDot[status], marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'capitalize' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusDot[status] }} />
              {status} ({items.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {items.map(trip => <TripCard key={trip._id} trip={trip} onView={id => navigate(`/trips/${id}/itinerary`)} onEdit={id => navigate(`/trips/${id}/build`)} onDelete={handleDelete} />)}
            </div>
          </section>
        ))
      )}
    </motion.div>
  );
};

export default MyTripsPage;
