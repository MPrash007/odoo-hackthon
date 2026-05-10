import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Share2, AlertTriangle, Edit } from 'lucide-react';
import { tripService } from '../services/tripService';
import { itineraryService } from '../services/itineraryService';
import { budgetService } from '../services/budgetService';
import { BudgetPieChart, BudgetBarChart } from '../components/BudgetChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateRange, getDayCount } from '../utils/formatDate';
import toast from 'react-hot-toast';

const ItineraryViewPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, b] = await Promise.all([tripService.getTrip(id), budgetService.getBudget(id)]);
        setTrip(t); setBudget(b);
        try { const i = await itineraryService.getItinerary(id); setItinerary(i); } catch {}
      } catch {} finally { setLoading(false); }
    }; load();
  }, [id]);

  const handleShare = () => { navigator.clipboard.writeText(`${window.location.origin}/public/${id}`); toast.success('Link copied!'); };

  if (loading) return <LoadingSpinner />;
  if (!trip) return <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>Trip not found</div>;

  const dayCount = getDayCount(trip.startDate, trip.endDate);
  const overBudget = budget && budget.totalSpent > budget.totalBudget && budget.totalBudget > 0;

  const cardStyle = { borderRadius: '18px', padding: '24px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(148,163,184,0.1)', backdropFilter: 'blur(12px)' };
  const actDotColors = { hotel: '#a78bfa', flight: '#60a5fa', food: '#fbbf24', transport: '#34d399', activity: '#22D3EE', sightseeing: '#f472b6' };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9' }}>{trip.title}</h1>
          <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '14px' }}>
            <Calendar style={{ width: '14px', height: '14px' }} /> {formatDateRange(trip.startDate, trip.endDate)} · {dayCount} days
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/trips/${id}/build`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.1)', color: '#cbd5e1', fontSize: '13px', textDecoration: 'none' }}>
            <Edit style={{ width: '14px', height: '14px' }} /> Edit
          </Link>
          <button onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)', color: '#22D3EE', fontSize: '13px', cursor: 'pointer' }}>
            <Share2 style={{ width: '14px', height: '14px' }} /> Share
          </button>
        </div>
      </div>

      {overBudget && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px' }}>
          <AlertTriangle style={{ width: '16px', height: '16px' }} /> Over budget by ${(budget.totalSpent - budget.totalBudget).toFixed(2)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr', gap: '24px' }}>
        {/* Itinerary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itinerary?.sections?.length > 0 ? itinerary.sections.map((section, idx) => (
            <div key={idx} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#f1f5f9' }}>{section.title}</h3>
                <span style={{ fontSize: '12px', color: '#94a3b8', background: 'rgba(148,163,184,0.08)', padding: '4px 10px', borderRadius: '8px' }}>
                  ${section.activities?.reduce((s,a) => s + (a.cost||0), 0)} spent
                </span>
              </div>
              {section.description && <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>{section.description}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {section.activities?.map((act, aIdx) => (
                  <div key={aIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(148,163,184,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: actDotColors[act.type] || '#22D3EE' }} />
                      <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{act.name}</span>
                      <span style={{ fontSize: '11px', color: '#475569', textTransform: 'capitalize' }}>{act.type}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#22D3EE' }}>${act.cost || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', ...cardStyle }}>
              <p style={{ color: '#64748b' }}>No itinerary yet.</p>
              <Link to={`/trips/${id}/build`} style={{ color: '#22D3EE', fontSize: '13px' }}>Build one now →</Link>
            </div>
          )}
        </div>

        {/* Budget Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '16px' }}>Budget Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { l: 'Total Budget', v: `$${budget?.totalBudget || 0}`, c: '#f1f5f9' },
                { l: 'Total Spent', v: `$${budget?.totalSpent || 0}`, c: overBudget ? '#f87171' : '#22D3EE' },
                { l: 'Remaining', v: `$${budget?.remaining || 0}`, c: '#f1f5f9' },
                { l: 'Avg/Day', v: `$${dayCount > 0 ? ((budget?.totalSpent||0)/dayCount).toFixed(0) : 0}`, c: '#f1f5f9' },
              ].map(s => (
                <div key={s.l} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(148,163,184,0.05)', border: '1px solid rgba(148,163,184,0.06)' }}>
                  <p style={{ fontSize: '11px', color: '#64748b' }}>{s.l}</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: s.c }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={cardStyle}><h3 style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '12px' }}>By Category</h3><BudgetPieChart breakdown={budget?.breakdown} /></div>
          <div style={cardStyle}><h3 style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '12px' }}>By Section</h3><BudgetBarChart sections={budget?.sections} /></div>
          <div style={{ ...cardStyle, padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { to: `/trips/${id}/checklist`, emoji: '📋', label: 'Packing Checklist' },
              { to: `/trips/${id}/notes`, emoji: '📝', label: 'Trip Notes' },
              { to: `/trips/${id}/expense`, emoji: '🧾', label: 'Expense Invoice' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', color: '#94a3b8', textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {l.emoji} {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryViewPage;
