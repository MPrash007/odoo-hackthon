import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Sparkles, Calendar, DollarSign, FileText, Plane, ArrowRight } from 'lucide-react';
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

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '0.01em' };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Header */}
      <div>
        <span className="eyebrow"><Sparkles style={{ width: '11px', height: '11px' }} /> Get started</span>
        <h1 className="font-display" style={{ fontSize: '34px', fontWeight: '800', color: '#f1f5f9', marginTop: '8px', letterSpacing: '-0.03em' }}>
          Create a <span className="text-gradient">new trip</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>Choose a destination, set your dates, and we'll suggest activities.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Trip name */}
          <div>
            <label style={labelStyle}>
              <FileText style={{ width: '12px', height: '12px', display: 'inline', marginRight: '6px', color: '#22D3EE' }} />
              Trip Name *
            </label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. European Summer 2025" />
          </div>

          {/* City selector */}
          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>
              <MapPin style={{ width: '12px', height: '12px', display: 'inline', marginRight: '6px', color: '#A78BFA' }} />
              Destination
            </label>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} />
              <input
                value={citySearch}
                onChange={e => { setCitySearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 180)}
                className="input-field input-with-icon" placeholder="Search cities…"
              />
            </div>
            <AnimatePresence>
              {showDropdown && filteredCities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: 'absolute', zIndex: 20, width: '100%', marginTop: '6px',
                    maxHeight: '260px', overflowY: 'auto', borderRadius: '14px',
                    background: 'rgba(10, 14, 28, 0.95)',
                    border: '1px solid rgba(148,163,184,0.15)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    padding: '6px',
                  }}>
                  {filteredCities.slice(0, 10).map(city => (
                    <button type="button" key={city._id} onClick={() => selectCity(city)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer',
                        textAlign: 'left', borderRadius: '10px', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <img src={city.coverImage} alt="" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{city.name}</p>
                        <p style={{ fontSize: '11px', color: '#64748b' }}>{city.country} · {city.region}</p>
                      </div>
                      <ArrowRight style={{ width: '14px', height: '14px', color: '#475569' }} />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                <Calendar style={{ width: '12px', height: '12px', display: 'inline', marginRight: '6px', color: '#60A5FA' }} />
                Start Date *
              </label>
              <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label style={labelStyle}>
                <Calendar style={{ width: '12px', height: '12px', display: 'inline', marginRight: '6px', color: '#60A5FA' }} />
                End Date *
              </label>
              <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} className="input-field" />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label style={labelStyle}>
              <DollarSign style={{ width: '12px', height: '12px', display: 'inline', marginRight: '6px', color: '#34d399' }} />
              Budget (₹)
            </label>
            <input type="number" value={form.totalBudget} onChange={e => setForm(p => ({ ...p, totalBudget: e.target.value }))} className="input-field" placeholder="5000" />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>
              <FileText style={{ width: '12px', height: '12px', display: 'inline', marginRight: '6px', color: '#F472B6' }} />
              Description
            </label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field" style={{ resize: 'none' }} placeholder="What's this trip about?" />
          </div>
        </div>

        {/* Suggestions */}
        {form.selectedCity && activities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="eyebrow"><Sparkles style={{ width: '11px', height: '11px' }} /> Inspired for you</span>
            <h3 className="section-header" style={{ marginTop: '6px', marginBottom: '16px' }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#22D3EE' }} />
              Activities in {form.selectedCity.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              {activities.slice(0, 6).map((a, i) => (
                <motion.div key={a._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <ActivityCard activity={a} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          type="submit" disabled={submitting} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px' }}
        >
          {submitting ? 'Creating...' : <>Create Trip <Plane style={{ width: '15px', height: '15px' }} /></>}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CreateTripPage;
