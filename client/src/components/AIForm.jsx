import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, Sparkles, Loader2, Compass } from 'lucide-react';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INTERESTS = [
  { label: 'Food & Cuisine', icon: '🍜' },
  { label: 'Culture & History', icon: '🏛️' },
  { label: 'Adventure & Sports', icon: '🏄' },
  { label: 'Shopping', icon: '🛍️' },
  { label: 'Nature & Hiking', icon: '🌿' },
  { label: 'Art & Museums', icon: '🎨' },
  { label: 'Nightlife', icon: '🌙' },
  { label: 'Wellness & Relaxation', icon: '🧘' },
  { label: 'Photography Spots', icon: '📸' },
];

const TRAVEL_STYLES = [
  { id: 'budget', icon: '🎒', title: 'Budget', desc: 'Hostels, public transit, cheap eats' },
  { id: 'mid', icon: '🏨', title: 'Mid-Range', desc: 'Hotels, mixed transit, nice dinners' },
  { id: 'luxury', icon: '✨', title: 'Luxury', desc: '5-star, private cars, fine dining' },
];

const AIForm = ({ loading, setLoading, setItinerary, streamText, setStreamText }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'INR',
    travelers: 1,
    travelStyle: 'mid',
    additionalNotes: '',
  });
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (label) => {
    setSelectedInterests(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination || !form.startDate || !form.endDate || !form.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setStreamText('');

    try {
      const result = await aiService.generateItinerary({
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: Number(form.budget),
        currency: form.currency,
        travelers: Number(form.travelers),
        travelStyle: form.travelStyle,
        interests: selectedInterests,
        additionalNotes: form.additionalNotes,
      }, (partial) => {
        setStreamText(partial);
      }, user.token);

      setItinerary(result);
      toast.success('Itinerary crafted successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'AI generation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const sectionCard = {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(17, 24, 39, 0.04)',
  };

  const labelStyle = {
    fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Destination & Dates */}
      <div style={sectionCard}>
        <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
          Where & When
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>
              <MapPin style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Destination
            </label>
            <input
              required
              value={form.destination}
              onChange={e => handleChange('destination', e.target.value)}
              className="input-field"
              placeholder="e.g. Tokyo, Japan"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                <Calendar style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Start Date
              </label>
              <input
                required
                type="date"
                value={form.startDate}
                onChange={e => handleChange('startDate', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Calendar style={{ width: '14px', height: '14px', color: '#2563EB' }} /> End Date
              </label>
              <input
                required
                type="date"
                value={form.endDate}
                onChange={e => handleChange('endDate', e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budget, Currency & Travelers */}
      <div style={sectionCard}>
        <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
          Budget & Travelers
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={labelStyle}>
              <DollarSign style={{ width: '14px', height: '14px', color: '#059669' }} /> Total Budget
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.budget}
              onChange={e => handleChange('budget', e.target.value)}
              className="input-field"
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label style={labelStyle}>
              Currency
            </label>
            <select
              value={form.currency}
              onChange={e => handleChange('currency', e.target.value)}
              className="input-field"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              <Users style={{ width: '14px', height: '14px', color: '#2563EB' }} /> Travelers
            </label>
            <input
              required
              type="number"
              min="1"
              value={form.travelers}
              onChange={e => handleChange('travelers', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Travel Style */}
      <div style={sectionCard}>
        <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
          Travel Style
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {TRAVEL_STYLES.map(style => {
            const isSelected = form.travelStyle === style.id;
            return (
              <div
                key={style.id}
                onClick={() => handleChange('travelStyle', style.id)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: `1px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`,
                  background: isSelected ? 'rgba(37, 99, 235, 0.04)' : '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{style.icon}</div>
                <div style={{ color: isSelected ? '#2563EB' : '#111827', fontWeight: '600', fontSize: '14px' }}>{style.title}</div>
                <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>{style.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interests */}
      <div style={sectionCard}>
        <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
          Interests & Activities
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {INTERESTS.map(interest => {
            const isSelected = selectedInterests.includes(interest.label);
            return (
              <button
                type="button"
                key={interest.label}
                onClick={() => toggleInterest(interest.label)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isSelected ? '#2563EB' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  border: `1px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`,
                }}
              >
                {interest.icon} {interest.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Notes */}
      <div style={sectionCard}>
        <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
          Additional Notes (Optional)
        </h3>
        <textarea
          value={form.additionalNotes}
          onChange={e => handleChange('additionalNotes', e.target.value)}
          className="input-field"
          rows={3}
          style={{ resize: 'none' }}
          placeholder="Any dietary restrictions, specific places you want to visit, pacing preferences..."
        />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.01 } : {}}
        whileTap={!loading ? { scale: 0.99 } : {}}
        style={{
          width: '100%', padding: '16px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          color: 'white', fontSize: '15px', fontWeight: '700',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.20)',
          opacity: loading ? 0.7 : 1,
          fontFamily: 'var(--font-heading)',
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 style={{ width: '18px', height: '18px' }} />
            </motion.div>
            Crafting your itinerary...
          </>
        ) : (
          <>
            <Sparkles style={{ width: '18px', height: '18px' }} />
            Generate My Trip ✨
          </>
        )}
      </motion.button>

      {/* Stream output */}
      <AnimatePresence>
        {loading && streamText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '20px',
              maxHeight: '200px', overflowY: 'auto',
              boxShadow: '0 1px 3px rgba(17, 24, 39, 0.04)',
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ✨ AI is thinking…
            </p>
            <pre style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px', color: '#475569',
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5,
            }}>
              {streamText}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default AIForm;
