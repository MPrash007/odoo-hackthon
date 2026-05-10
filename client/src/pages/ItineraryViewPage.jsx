import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Share2, AlertTriangle, Edit, MapPin, Sparkles, Wallet, FileText, CheckSquare, Receipt, Globe } from 'lucide-react';
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
    };
    load();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/public/${id}`);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <LoadingSpinner />;
  if (!trip) return <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>Trip not found</div>;

  const dayCount = getDayCount(trip.startDate, trip.endDate);
  const overBudget = budget && budget.totalSpent > budget.totalBudget && budget.totalBudget > 0;
  const actDotColors = { hotel: '#a78bfa', flight: '#60a5fa', food: '#fbbf24', transport: '#34d399', activity: '#22D3EE', sightseeing: '#f472b6' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}
    >
      {/* Hero header card */}
      <div className="gradient-border noise" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>
        {trip.coverPhoto && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.20 }}>
            <img src={trip.coverPhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8, 12, 28, 0.85), rgba(8, 12, 28, 0.95))' }} />
          </div>
        )}
        <div className="animate-float-slow" style={{ position: 'absolute', top: '-60px', right: '20%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.20), transparent 70%)' }} />

        <div style={{ position: 'relative', padding: '32px clamp(24px, 4vw, 40px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <span className="eyebrow"><Sparkles style={{ width: '11px', height: '11px' }} /> Trip overview</span>
              <h1 className="font-display" style={{
                fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: '800', color: '#f1f5f9',
                marginTop: '8px', letterSpacing: '-0.03em', lineHeight: 1.1,
              }}>
                {trip.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '13px' }}>
                  <Calendar style={{ width: '14px', height: '14px', color: '#22D3EE' }} />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </span>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }} />
                <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
                  {dayCount} {dayCount === 1 ? 'day' : 'days'}
                </span>
                {trip.destinations?.length > 0 && (
                  <>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }} />
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '13px' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: '#A78BFA' }} />
                      {trip.destinations.join(' · ')}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to={`/trips/${id}/build`} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 18px', borderRadius: '12px',
                background: 'rgba(148, 163, 184, 0.06)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                color: '#cbd5e1', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              }}>
                <Edit style={{ width: '14px', height: '14px' }} /> Edit
              </Link>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={async () => {
                  try {
                    const updated = await tripService.togglePublic(id);
                    setTrip({ ...trip, isPublic: updated.isPublic });
                    toast.success(updated.isPublic ? 'Trip is now public!' : 'Trip is now private');
                  } catch (err) {
                    toast.error('Failed to change visibility');
                  }
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 18px', borderRadius: '12px',
                  background: trip.isPublic ? 'rgba(52, 211, 153, 0.1)' : 'rgba(148, 163, 184, 0.06)',
                  border: `1px solid ${trip.isPublic ? 'rgba(52, 211, 153, 0.3)' : 'rgba(148, 163, 184, 0.12)'}`,
                  color: trip.isPublic ? '#34d399' : '#cbd5e1', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}>
                <Globe style={{ width: '14px', height: '14px' }} /> {trip.isPublic ? 'Public' : 'Private'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={handleShare}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 18px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))',
                  border: '1px solid rgba(6, 182, 212, 0.30)',
                  color: '#22D3EE', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.20)',
                }}>
                <Share2 style={{ width: '14px', height: '14px' }} /> Share
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {overBudget && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 18px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5', fontSize: '13px', fontWeight: 500,
          }}
        >
          <AlertTriangle style={{ width: '16px', height: '16px' }} />
          Over budget by ₹{(budget.totalSpent - budget.totalBudget).toFixed(2)}
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr', gap: '24px' }}>
        {/* Itinerary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itinerary?.sections?.length > 0 ? itinerary.sections.map((section, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
              className="glass" style={{ padding: '22px', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', top: '20px', bottom: '20px', left: 0, width: '3px',
                borderRadius: '0 4px 4px 0',
                background: 'linear-gradient(180deg, #22D3EE, #8B5CF6)',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.30)',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '26px', height: '26px', borderRadius: '8px',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
                    color: '#22D3EE', fontWeight: 700, fontSize: '11px',
                    border: '1px solid rgba(6, 182, 212, 0.20)',
                  }}>{idx + 1}</span>
                  <h3 className="font-display" style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.01em' }}>{section.title}</h3>
                </div>
                <span style={{
                  fontSize: '11px', color: '#22D3EE', fontWeight: 700,
                  background: 'rgba(6, 182, 212, 0.10)',
                  border: '1px solid rgba(6, 182, 212, 0.20)',
                  padding: '5px 12px', borderRadius: '999px',
                }}>
                  ₹{section.activities?.reduce((s, a) => s + (a.cost || 0), 0)} total
                </span>
              </div>
              {section.description && <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.55 }}>{section.description}</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {section.activities?.map((act, aIdx) => (
                  <motion.div key={aIdx}
                    whileHover={{ x: 4 }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: '12px',
                      background: 'rgba(15, 19, 36, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.06)',
                      transition: 'all 0.2s',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: actDotColors[act.type] || '#22D3EE',
                        boxShadow: `0 0 10px ${actDotColors[act.type] || '#22D3EE'}`,
                      }} />
                      <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{act.name}</span>
                      <span style={{
                        fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em',
                        background: 'rgba(148, 163, 184, 0.06)', padding: '2px 7px', borderRadius: '5px',
                      }}>{act.type}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#22D3EE' }}>₹{act.cost || 0}</span>
                  </motion.div>
                ))}
                {(!section.activities || section.activities.length === 0) && (
                  <p style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', padding: '6px 0' }}>No activities yet</p>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="glass" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <FileText style={{ width: '40px', height: '40px', color: '#475569', margin: '0 auto 14px' }} />
              <p style={{ color: '#94a3b8', marginBottom: '8px' }}>No itinerary yet.</p>
              <Link to={`/trips/${id}/build`} style={{ color: '#22D3EE', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Build one now →</Link>
            </div>
          )}
        </div>

        {/* Budget Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass" style={{ padding: '20px' }}>
            <h3 className="font-display" style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet style={{ width: '16px', height: '16px', color: '#22D3EE' }} /> Budget Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { l: 'Total', v: `₹${budget?.totalBudget || 0}`, c: '#f1f5f9' },
                { l: 'Spent', v: `₹${budget?.totalSpent || 0}`, c: overBudget ? '#f87171' : '#22D3EE' },
                { l: 'Remaining', v: `₹${budget?.remaining || 0}`, c: '#34d399' },
                { l: 'Avg/Day', v: `₹${dayCount > 0 ? ((budget?.totalSpent || 0) / dayCount).toFixed(0) : 0}`, c: '#A78BFA' },
              ].map(s => (
                <div key={s.l} style={{
                  padding: '12px', borderRadius: '12px',
                  background: 'rgba(15, 19, 36, 0.6)', border: '1px solid rgba(148, 163, 184, 0.08)',
                }}>
                  <p style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.l}</p>
                  <p className="font-display" style={{ fontSize: '20px', fontWeight: '800', color: s.c, marginTop: '4px', letterSpacing: '-0.01em' }}>{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass" style={{ padding: '20px' }}>
            <h3 className="font-display" style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '12px' }}>By Category</h3>
            <BudgetPieChart breakdown={budget?.breakdown} />
          </div>

          <div className="glass" style={{ padding: '20px' }}>
            <h3 className="font-display" style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '12px' }}>By Section</h3>
            <BudgetBarChart sections={budget?.sections} />
          </div>

          <div className="glass" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { to: `/trips/${id}/checklist`, icon: CheckSquare, label: 'Packing Checklist', color: '#34d399' },
              { to: `/trips/${id}/notes`, icon: FileText, label: 'Trip Notes', color: '#A78BFA' },
              { to: `/trips/${id}/expense`, icon: Receipt, label: 'Expense Invoice', color: '#F472B6' },
            ].map(l => {
              const Icon = l.icon;
              return (
                <Link key={l.to} to={l.to} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '12px',
                  fontSize: '13px', color: '#cbd5e1', fontWeight: 500,
                  textDecoration: 'none', transition: 'all 0.18s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <span style={{
                    width: '30px', height: '30px', borderRadius: '9px',
                    background: `${l.color}1a`, border: `1px solid ${l.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: '14px', height: '14px', color: l.color }} />
                  </span>
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryViewPage;
