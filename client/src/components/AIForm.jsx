import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    travelers: 1,
    travelStyle: 'mid',
    additionalNotes: ''
  });
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (label) => {
    setSelectedInterests(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setStreamText('');

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/ai/generate-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests
        })
      });

      if (!response.ok) throw new Error('Failed to generate itinerary');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        // Decode the new chunk and append it to our buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Split by newline to get individual SSE events
        const lines = buffer.split('\n');
        
        // The last element is either an incomplete line or an empty string (if it ended with \n)
        // We pop it off and keep it in the buffer for the next chunk
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              if (data.chunk) {
                setStreamText(prev => prev + data.chunk);
              }
              if (data.done) {
                const parsed = JSON.parse(data.full);
                setItinerary(parsed);
                setLoading(false);
                return;
              }
            } catch (e) {
              console.error('JSON Parse Error:', e);
            }
          }
        }
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '32px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Destination */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Where do you want to go?</label>
          <input required type="text" placeholder="e.g. Tokyo, Japan" className="input-field" value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }} />
        </div>

        {/* Dates */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Start Date</label>
            <input required type="date" className="input-field" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>End Date</label>
            <input required type="date" className="input-field" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }} />
          </div>
        </div>

        {/* Budget, Currency, Travelers */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Total Budget</label>
            <input required type="number" min="0" placeholder="e.g. 5000" className="input-field" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Currency</label>
            <select className="input-field" value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Travelers</label>
            <input required type="number" min="1" className="input-field" value={formData.travelers} onChange={e => setFormData({ ...formData, travelers: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }} />
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Travel Style</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {TRAVEL_STYLES.map(style => (
              <div key={style.id} onClick={() => setFormData({ ...formData, travelStyle: style.id })} style={{
                padding: '16px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s',
                border: `1px solid ${formData.travelStyle === style.id ? '#22D3EE' : 'rgba(255,255,255,0.1)'}`,
                background: formData.travelStyle === style.id ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{style.icon}</div>
                <div style={{ color: formData.travelStyle === style.id ? '#22D3EE' : 'white', fontWeight: '600', fontSize: '14px' }}>{style.title}</div>
                <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{style.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Interests & Activities</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {INTERESTS.map(interest => {
              const isSelected = selectedInterests.includes(interest.label);
              return (
                <button type="button" key={interest.label} onClick={() => toggleInterest(interest.label)} style={{
                  padding: '8px 16px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
                  background: isSelected ? '#06B6D4' : 'transparent',
                  color: isSelected ? 'white' : '#67e8f9',
                  border: `1px solid ${isSelected ? '#06B6D4' : 'rgba(6, 182, 212, 0.4)'}`,
                }}>
                  {interest.icon} {interest.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Additional Notes (Optional)</label>
          <textarea rows="3" placeholder="Any dietary restrictions, specific places you want to visit, pacing preferences..." className="input-field" value={formData.additionalNotes} onChange={e => setFormData({ ...formData, additionalNotes: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '12px' }} />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} style={{
          padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', color: 'white',
          background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.8 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
        }}>
          {loading ? (
            <>
              <div className="shimmer-effect" style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white' }} />
              AI is crafting your itinerary...
            </>
          ) : (
            <><Sparkles /> Generate My Trip ✨</>
          )}
        </button>

        {/* Streaming Terminal */}
        {loading && streamText && (
          <div style={{
            marginTop: '16px', padding: '16px', borderRadius: '12px',
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(6, 182, 212, 0.3)',
            color: '#67e8f9', fontFamily: 'monospace', fontSize: '13px',
            whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto'
          }}>
            <span style={{ color: '#06B6D4' }}>AI › </span>
            {streamText}
            <span className="animate-pulse">▋</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default AIForm;
