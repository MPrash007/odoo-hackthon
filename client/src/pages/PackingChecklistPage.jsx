import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Trash2, RotateCcw, Printer } from 'lucide-react';
import { checklistService } from '../services/budgetService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const categories = ['clothing', 'documents', 'electronics', 'toiletries', 'other'];
const catIcons = { clothing: '👕', documents: '📄', electronics: '📱', toiletries: '🧴', other: '📦' };

const PackingChecklistPage = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [newCat, setNewCat] = useState('other');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { checklistService.getChecklist(id).then(setItems).finally(() => setLoading(false)); }, [id]);

  const addItem = async () => {
    if (!newLabel.trim()) return;
    try { const item = await checklistService.addItem(id, { label: newLabel, category: newCat }); setItems(p => [...p, item]); setNewLabel(''); toast.success('Added'); } catch { toast.error('Failed'); }
  };
  const toggleItem = async (item) => {
    setItems(p => p.map(i => i._id === item._id ? { ...i, isPacked: !i.isPacked } : i));
    try { await checklistService.toggleItem(item._id); } catch { setItems(p => p.map(i => i._id === item._id ? { ...i, isPacked: !i.isPacked } : i)); }
  };
  const deleteItem = async (itemId) => { setItems(p => p.filter(i => i._id !== itemId)); try { await checklistService.deleteItem(itemId); } catch { toast.error('Failed'); } };
  const resetAll = async () => { if (!window.confirm('Reset all?')) return; try { const u = await checklistService.resetChecklist(id); setItems(u); toast.success('Reset'); } catch { toast.error('Failed'); } };

  const filtered = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);
  const packed = items.filter(i => i.isPacked).length;
  const total = items.length;
  const progress = total > 0 ? (packed / total) * 100 : 0;
  const tabStyle = (active) => ({ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', background: active ? 'rgba(6,182,212,0.15)' : 'rgba(148,163,184,0.06)', color: active ? '#22D3EE' : '#94a3b8', border: `1px solid ${active ? 'rgba(6,182,212,0.3)' : 'rgba(148,163,184,0.1)'}`, transition: 'all 0.2s' });

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}><CheckSquare style={{ width: '26px', height: '26px', color: '#06B6D4' }} />Packing Checklist</h1>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={resetAll} title="Reset" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><RotateCcw style={{ width: '16px', height: '16px' }} /></button>
          <button onClick={() => window.print()} title="Print" style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}><Printer style={{ width: '16px', height: '16px' }} /></button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ borderRadius: '14px', padding: '16px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '13px', color: '#94a3b8' }}>{packed}/{total} items packed</span><span style={{ fontSize: '13px', fontWeight: '700', color: '#22D3EE' }}>{progress.toFixed(0)}%</span></div>
        <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}><motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #0891B2, #06B6D4)' }} /></div>
      </div>

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }} className="scrollbar-hide">
        <button onClick={() => setActiveTab('all')} style={tabStyle(activeTab === 'all')}>All</button>
        {categories.map(c => <button key={c} onClick={() => setActiveTab(c)} style={tabStyle(activeTab === c)}>{catIcons[c]} {c}</button>)}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && addItem()} className="input-field" style={{ flex: 1 }} placeholder="Add item..." />
        <select value={newCat} onChange={e => setNewCat(e.target.value)} className="input-field" style={{ width: '140px' }}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
        <button onClick={addItem} style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(6,182,212,0.12)', color: '#22D3EE', border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}><Plus style={{ width: '16px', height: '16px' }} /></button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <AnimatePresence>
          {filtered.map(item => (
            <motion.div key={item._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: item.isPacked ? 'rgba(6,182,212,0.05)' : 'rgba(15,23,42,0.7)', border: `1px solid ${item.isPacked ? 'rgba(6,182,212,0.15)' : 'rgba(148,163,184,0.08)'}`, transition: 'all 0.2s' }}>
              <button onClick={() => toggleItem(item)} style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${item.isPacked ? '#06B6D4' : '#475569'}`, background: item.isPacked ? '#06B6D4' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                {item.isPacked && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
              </button>
              <span style={{ fontSize: '12px' }}>{catIcons[item.category]}</span>
              <span style={{ flex: 1, fontSize: '13px', color: item.isPacked ? '#475569' : '#f1f5f9', textDecoration: item.isPacked ? 'line-through' : 'none' }}>{item.label}</span>
              <button onClick={() => deleteItem(item._id)} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}><Trash2 style={{ width: '14px', height: '14px' }} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#475569', padding: '32px', fontSize: '13px' }}>No items. Add some above!</p>}
      </div>
    </motion.div>
  );
};

export default PackingChecklistPage;
