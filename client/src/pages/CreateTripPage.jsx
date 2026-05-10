import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { activityService } from '../services/activityService';
import { tripService } from '../services/tripService';
import ActivityCard from '../components/ActivityCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [form, setForm] = useState({ title: '', selectedCity: null, startDate: '', endDate: '', totalBudget: '', description: '' });

  useEffect(() => { activityService.getCities().then(setCities).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (form.selectedCity) activityService.getActivities({ city: form.selectedCity._id }).then(setActivities); }, [form.selectedCity]);

  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  const selectCity = (city) => { setForm(p => ({ ...p, selectedCity: city, title: p.title || `Trip to ${city.name}` })); setCitySearch(city.name); setShowDropdown(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) return toast.error('Fill required fields');
    setSubmitting(true);
    try {
      const trip = await tripService.createTrip({ title: form.title, description: form.description, startDate: form.startDate, endDate: form.endDate, destinations: form.selectedCity ? [form.selectedCity.name] : [], totalBudget: Number(form.totalBudget) || 0, coverPhoto: form.selectedCity?.coverImage || '' });
      toast.success('Trip created!'); navigate(`/trips/${trip._id}/build`);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px' }}>Create a New Trip</h1>
        <p style={{ color: '#64748b', fontSize: '15px' }}>Choose a destination and set your dates.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{
          borderRadius: '20px', padding: '28px',
          background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148, 163, 184, 0.1)',
          backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          <div><label style={labelStyle}>Trip Name *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. European Summer 2025" /></div>

          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>Select a Place</label>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} />
              <input value={citySearch} onChange={e => { setCitySearch(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)}
                className="input-field input-with-icon" placeholder="Search cities..." />
            </div>
            {showDropdown && filteredCities.length > 0 && (
              <div style={{
                position: 'absolute', zIndex: 20, width: '100%', marginTop: '4px',
                maxHeight: '220px', overflowY: 'auto', borderRadius: '14px',
                background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(148,163,184,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                {filteredCities.map(city => (
                  <button type="button" key={city._id} onClick={() => selectCity(city)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <img src={city.coverImage} alt="" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div><p style={{ fontSize: '13px', fontWeight: '500', color: '#f1f5f9' }}>{city.name}</p><p style={{ fontSize: '11px', color: '#64748b' }}>{city.country} · {city.region}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={labelStyle}>Start Date *</label><input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="input-field" /></div>
            <div><label style={labelStyle}>End Date *</label><input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="input-field" /></div>
          </div>

          <div><label style={labelStyle}>Budget ($)</label><input type="number" value={form.totalBudget} onChange={e => setForm(p => ({ ...p, totalBudget: e.target.value }))} className="input-field" placeholder="5000" /></div>

          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field" style={{ resize: 'none' }} placeholder="Trip description..." /></div>
        </div>

        {/* Suggestions */}
        {form.selectedCity && activities.length > 0 && (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '18px', height: '18px', color: '#06B6D4' }} /> Suggested for {form.selectedCity.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {activities.map(a => <ActivityCard key={a._id} activity={a} />)}
            </div>
          </div>
        )}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={submitting} className="btn-primary" style={{ padding: '14px' }}>
          {submitting ? 'Creating...' : 'Create Trip'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateTripPage;
