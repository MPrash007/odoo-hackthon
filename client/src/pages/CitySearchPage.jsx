import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, DollarSign } from 'lucide-react';
import { activityService } from '../services/activityService';
import ActivityCard from '../components/ActivityCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CitySearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('cities');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try { const [c, a] = await Promise.all([activityService.getCities(), activityService.getActivities()]); setCities(c); setActivities(a); if (searchParams.get('city')) setTab('activities'); }
      catch {} finally { setLoading(false); }
    }; load();
  }, []);

  const filteredCities = cities.filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase()));
  const filteredActivities = activities.filter(a => { const mQ = !query || a.name.toLowerCase().includes(query.toLowerCase()); const mT = !typeFilter || a.type === typeFilter; return mQ && mT; });

  if (loading) return <LoadingSpinner />;

  const tabStyle = (active) => ({
    padding: '8px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '500', cursor: 'pointer',
    background: active ? 'rgba(6,182,212,0.15)' : 'rgba(148,163,184,0.06)',
    color: active ? '#22D3EE' : '#94a3b8',
    border: `1px solid ${active ? 'rgba(6,182,212,0.3)' : 'rgba(148,163,184,0.1)'}`,
    transition: 'all 0.2s',
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>Discover</h1>

      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b', pointerEvents: 'none' }} />
        <input value={query} onChange={e => setQuery(e.target.value)} className="input-field" style={{ paddingLeft: '48px', padding: '14px 16px 14px 48px', borderRadius: '14px' }} placeholder="Search cities or activities..." />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setTab('cities')} style={tabStyle(tab === 'cities')}>Cities</button>
        <button onClick={() => setTab('activities')} style={tabStyle(tab === 'activities')}>Activities</button>
        {tab === 'activities' && (
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field" style={{ width: 'auto', padding: '8px 12px', borderRadius: '10px', fontSize: '12px' }}>
            <option value="">All Types</option><option value="sightseeing">Sightseeing</option><option value="food">Food</option><option value="adventure">Adventure</option><option value="culture">Culture</option><option value="relaxation">Relaxation</option>
          </select>
        )}
      </div>

      {tab === 'cities' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {filteredCities.map((city, i) => (
            <motion.div key={city._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              onClick={() => { setQuery(city.name); setTab('activities'); }}
              style={{ borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: '1px solid rgba(148,163,184,0.1)', cursor: 'pointer' }}
              className="card-hover group">
              <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                <img src={city.coverImage} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="group-hover:scale-110" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,11,20,0.85), transparent 50%)' }} />
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>{city.name}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin style={{ width: '11px', height: '11px' }} />{city.country} · {city.region}</p>
                <p style={{ fontSize: '11px', color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{city.description}</p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><DollarSign style={{ width: '11px', height: '11px' }} />{city.costIndex}/10</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Star style={{ width: '11px', height: '11px', color: '#f59e0b' }} />{city.popularity}/10</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {city.tags?.slice(0, 3).map(t => <span key={t} style={{ padding: '2px 8px', borderRadius: '999px', background: 'rgba(6,182,212,0.1)', color: '#22D3EE', fontSize: '10px' }}>{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {filteredActivities.map(a => <ActivityCard key={a._id} activity={a} />)}
          {filteredActivities.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>No activities found.</p>}
        </div>
      )}
    </motion.div>
  );
};

export default CitySearchPage;
