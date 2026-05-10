import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, DollarSign, Compass, Sparkles, Globe } from 'lucide-react';
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
      try {
        const [c, a] = await Promise.all([activityService.getCities(), activityService.getActivities()]);
        setCities(c); setActivities(a);
        if (searchParams.get('city')) setTab('activities');
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const filteredCities = cities.filter(c => !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase()));
  const filteredActivities = activities.filter(a => {
    const mQ = !query || 
      a.name.toLowerCase().includes(query.toLowerCase()) || 
      (a.city?.name && a.city.name.toLowerCase().includes(query.toLowerCase()));
    const mT = !typeFilter || a.type === typeFilter;
    return mQ && mT;
  });

  if (loading) return <LoadingSpinner />;

  const tabStyle = (active) => ({
    padding: '10px 22px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    background: active ? 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))' : 'rgba(148,163,184,0.06)',
    color: active ? '#22D3EE' : '#94a3b8',
    border: `1px solid ${active ? 'rgba(6,182,212,0.30)' : 'rgba(148,163,184,0.10)'}`,
    transition: 'all 0.2s',
    boxShadow: active ? '0 4px 16px rgba(6, 182, 212, 0.20)' : 'none',
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>

      {/* Header */}
      <div>
        <span className="eyebrow"><Compass style={{ width: '11px', height: '11px' }} /> Explore</span>
        <h1 className="font-display" style={{ fontSize: '34px', fontWeight: '800', color: '#f1f5f9', marginTop: '6px', letterSpacing: '-0.03em' }}>
          Discover <span className="text-gradient">amazing places</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
          {cities.length} cities and {activities.length} activities curated for you.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#64748b', pointerEvents: 'none' }} />
        <input value={query} onChange={e => setQuery(e.target.value)} className="input-field"
          style={{ paddingLeft: '50px', padding: '16px 18px 16px 50px', borderRadius: '16px' }}
          placeholder="Search cities or activities..." />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setTab('cities')} style={tabStyle(tab === 'cities')}>
          <Globe style={{ width: '13px', height: '13px', display: 'inline', marginRight: '6px' }} />
          Cities · {filteredCities.length}
        </button>
        <button onClick={() => setTab('activities')} style={tabStyle(tab === 'activities')}>
          <Sparkles style={{ width: '13px', height: '13px', display: 'inline', marginRight: '6px' }} />
          Activities · {filteredActivities.length}
        </button>
        {tab === 'activities' && (
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field"
            style={{ width: 'auto', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
            <option value="">All Types</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="food">Food</option>
            <option value="adventure">Adventure</option>
            <option value="culture">Culture</option>
            <option value="relaxation">Relaxation</option>
          </select>
        )}
      </div>

      {tab === 'cities' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filteredCities.map((city, i) => (
            <motion.div key={city._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -8 }}
              onClick={() => { setQuery(city.name); setTab('activities'); }}
              style={{
                position: 'relative',
                borderRadius: '20px', overflow: 'hidden',
                background: 'linear-gradient(160deg, rgba(31, 42, 68, 0.50), rgba(10, 14, 28, 0.85))',
                border: '1px solid rgba(148,163,184,0.10)',
                cursor: 'pointer',
              }}
              className="card-hover group"
            >
              <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                <img src={city.coverImage} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }} className="group-hover:scale-110" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8, 12, 28, 0.92), transparent 55%)' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: '700',
                    background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.30)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Star style={{ width: '10px', height: '10px' }} /> {city.popularity}/10
                  </span>
                </div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 className="font-display" style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.01em' }}>{city.name}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '11px', height: '11px' }} />{city.country} · {city.region}
                </p>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{city.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#94a3b8', paddingTop: '8px', borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <DollarSign style={{ width: '11px', height: '11px', color: '#34d399' }} />Cost {city.costIndex}/10
                  </span>
                </div>
                {city.tags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {city.tags.slice(0, 3).map(t => (
                      <span key={t} style={{
                        padding: '3px 9px', borderRadius: '999px', fontSize: '10px', fontWeight: 500,
                        background: 'rgba(6,182,212,0.10)', color: '#22D3EE',
                        border: '1px solid rgba(6,182,212,0.20)',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {filteredActivities.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ActivityCard activity={a} />
            </motion.div>
          ))}
          {filteredActivities.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center', gridColumn: '1 / -1', padding: '60px' }}>No activities found.</p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CitySearchPage;
