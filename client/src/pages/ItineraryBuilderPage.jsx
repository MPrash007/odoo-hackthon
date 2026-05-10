import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { tripService } from '../services/tripService';
import { itineraryService } from '../services/itineraryService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const emptySection = () => ({ title: 'New Section', description: '', dateRange: { start: '', end: '' }, budget: 0, activities: [] });
const emptyActivity = () => ({ name: '', type: 'activity', date: '', time: '', cost: 0, notes: '' });

const ItineraryBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [sections, setSections] = useState([emptySection()]);
  const [itineraryId, setItineraryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const t = await tripService.getTrip(id); setTrip(t);
        try { const itin = await itineraryService.getItinerary(id); if (itin?.sections?.length) { setSections(itin.sections); setItineraryId(itin._id); } } catch {}
      } catch { toast.error('Trip not found'); navigate('/trips'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const updateSection = (idx, field, value) => setSections(p => p.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  const updateDateRange = (idx, field, value) => setSections(p => p.map((s, i) => i === idx ? { ...s, dateRange: { ...s.dateRange, [field]: value } } : s));
  const addActivity = (sIdx) => setSections(p => p.map((s, i) => i === sIdx ? { ...s, activities: [...s.activities, emptyActivity()] } : s));
  const updateActivity = (sIdx, aIdx, field, value) => setSections(p => p.map((s, i) => i === sIdx ? { ...s, activities: s.activities.map((a, j) => j === aIdx ? { ...a, [field]: value } : a) } : s));
  const removeActivity = (sIdx, aIdx) => setSections(p => p.map((s, i) => i === sIdx ? { ...s, activities: s.activities.filter((_, j) => j !== aIdx) } : s));
  const addSection = () => setSections(p => [...p, emptySection()]);
  const removeSection = (idx) => setSections(p => p.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setSaving(true);
    try { const res = await itineraryService.createOrUpdate(id, sections); setItineraryId(res._id); toast.success('Itinerary saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  const sectionCardStyle = {
    borderRadius: '18px', padding: '24px',
    background: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column', gap: '16px',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9' }}>{trip?.title || 'Itinerary Builder'}</h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Add sections and activities for each phase of your trip</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #0891B2, #06B6D4)', color: 'white', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(6,182,212,0.3)', opacity: saving ? 0.5 : 1 }}>
          <Save style={{ width: '15px', height: '15px' }} /> {saving ? 'Saving...' : 'Save Itinerary'}
        </motion.button>
      </div>

      {sections.map((section, sIdx) => (
        <motion.div key={sIdx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sIdx * 0.1 }} style={sectionCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <GripVertical style={{ width: '16px', height: '16px', color: '#475569', cursor: 'grab' }} />
              <input value={section.title} onChange={e => updateSection(sIdx, 'title', e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: '18px', fontWeight: '700', width: '100%' }} placeholder="Section Title" />
            </div>
            <button onClick={() => removeSection(sIdx)} style={{ padding: '6px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              <Trash2 style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          <textarea value={section.description} onChange={e => updateSection(sIdx, 'description', e.target.value)} rows={2} className="input-field" style={{ resize: 'none' }} placeholder="Description..." />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div><label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>From</label><input type="date" value={section.dateRange?.start?.split('T')[0] || ''} onChange={e => updateDateRange(sIdx, 'start', e.target.value)} className="input-field" /></div>
            <div><label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>To</label><input type="date" value={section.dateRange?.end?.split('T')[0] || ''} onChange={e => updateDateRange(sIdx, 'end', e.target.value)} className="input-field" /></div>
            <div><label style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Budget ($)</label><input type="number" value={section.budget} onChange={e => updateSection(sIdx, 'budget', Number(e.target.value))} className="input-field" /></div>
          </div>

          {/* Activities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>Activities</h4>
            {section.activities.map((act, aIdx) => (
              <div key={aIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input value={act.name} onChange={e => updateActivity(sIdx, aIdx, 'name', e.target.value)} className="input-field" style={{ flex: 1 }} placeholder="Activity name" />
                <select value={act.type} onChange={e => updateActivity(sIdx, aIdx, 'type', e.target.value)} className="input-field" style={{ width: '130px' }}>
                  <option value="hotel">Hotel</option><option value="flight">Flight</option><option value="activity">Activity</option><option value="food">Food</option><option value="transport">Transport</option><option value="sightseeing">Sightseeing</option>
                </select>
                <input type="number" value={act.cost} onChange={e => updateActivity(sIdx, aIdx, 'cost', Number(e.target.value))} className="input-field" style={{ width: '100px' }} placeholder="Cost" />
                <button onClick={() => removeActivity(sIdx, aIdx)} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><Trash2 style={{ width: '14px', height: '14px' }} /></button>
              </div>
            ))}
            <button onClick={() => addActivity(sIdx)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#06B6D4', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              <Plus style={{ width: '14px', height: '14px' }} /> Add Activity
            </button>
          </div>
        </motion.div>
      ))}

      <button onClick={addSection} style={{
        width: '100%', padding: '14px', borderRadius: '14px',
        border: '2px dashed rgba(148, 163, 184, 0.15)', background: 'transparent',
        color: '#64748b', fontSize: '14px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.color = '#06B6D4'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; e.currentTarget.style.color = '#64748b'; }}>
        <Plus style={{ width: '16px', height: '16px' }} /> Add another Section
      </button>
    </motion.div>
  );
};

export default ItineraryBuilderPage;
