import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RefreshCcw, Save, Share2, MapPin, Calendar, DollarSign, Lightbulb, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DayCard from './DayCard';

const COLORS = ['#06B6D4', '#8B5CF6', '#F59E0B', '#10B981', '#EC4899'];

const ItineraryResult = ({ itinerary, onReset }) => {
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const userStr = localStorage.getItem('traveloop_user');
      const token = userStr ? JSON.parse(userStr).token : null;
      
      if (!token) {
        toast.error('Please log in to save trips');
        return;
      }
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/ai/save-itinerary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ aiItinerary: itinerary })
      });
      
      if (!res.ok) throw new Error('Failed to save trip');
      const data = await res.json();
      
      toast.success('Trip saved successfully!');
      navigate(`/trips/${data.tripId}/build`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  // Prepare chart data
  const chartData = itinerary.budgetBreakdown ? [
    { name: 'Accommodation', value: itinerary.budgetBreakdown.accommodation || 0 },
    { name: 'Food', value: itinerary.budgetBreakdown.food || 0 },
    { name: 'Activities', value: itinerary.budgetBreakdown.activities || 0 },
    { name: 'Transport', value: itinerary.budgetBreakdown.transport || 0 },
    { name: 'Misc', value: itinerary.budgetBreakdown.miscellaneous || 0 },
  ].filter(d => d.value > 0) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Section */}
      <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.1))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '40px 32px', textAlign: 'center' }}>
        <h1 className="font-display" style={{ fontSize: '36px', color: 'white', marginBottom: '16px', fontWeight: '800' }}>{itinerary.tripTitle}</h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', color: '#e2e8f0', fontSize: '14px' }}><MapPin size={16} color="#06B6D4" /> {itinerary.destination}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', color: '#e2e8f0', fontSize: '14px' }}><Calendar size={16} color="#8B5CF6" /> {itinerary.totalDays} Days</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', color: '#e2e8f0', fontSize: '14px' }}><DollarSign size={16} color="#10B981" /> {itinerary.estimatedTotalCost} {itinerary.currency}</span>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 24px' }}>
          {itinerary.summary}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {itinerary.highlights?.map((hl, i) => (
            <span key={i} style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22D3EE', padding: '6px 14px', borderRadius: '12px', fontSize: '13px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>{hl}</span>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Budget Breakdown */}
        {chartData.length > 0 && (
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Budget Breakdown</h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none" isAnimationActive={true}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} itemStyle={{ color: 'white' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckSquare size={20} color="#06B6D4" /> Packing Essentials</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {itinerary.packingEssentials?.map((item, i) => (
                <span key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', padding: '6px 12px', borderRadius: '8px', fontSize: '13px' }}>{item}</span>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb size={20} color="#F59E0B" /> Travel Tips</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {itinerary.travelTips?.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Day by Day */}
      <div>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>Day-by-Day Itinerary</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itinerary.days?.map((day, index) => (
            <DayCard key={day.day} day={day} isDefaultOpen={index === 0} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
          <RefreshCcw size={18} /> Plan Another Trip
        </button>
        <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
          <Share2 size={18} /> Share
        </button>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)' }}>
          <Save size={18} /> Save to My Trips
        </button>
      </div>

    </div>
  );
};

export default ItineraryResult;
