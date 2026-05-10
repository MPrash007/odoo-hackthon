import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { budgetService } from '../services/budgetService';
import { tripService } from '../services/tripService';
import { BudgetPieChart, BudgetBarChart } from '../components/BudgetChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDayCount } from '../utils/formatDate';

const BudgetPage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const [t, b] = await Promise.all([tripService.getTrip(id), budgetService.getBudget(id)]); setTrip(t); setBudget(b); } catch {} finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  const days = getDayCount(trip?.startDate, trip?.endDate);
  const over = budget && budget.totalSpent > budget.totalBudget && budget.totalBudget > 0;

  const stats = [
    { label: 'Total Budget', val: `₹${(budget?.totalBudget || 0).toLocaleString()}`, icon: Wallet, color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.10)', border: 'rgba(34, 211, 238, 0.20)' },
    { label: 'Spent', val: `₹${(budget?.totalSpent || 0).toLocaleString()}`, icon: TrendingDown, color: over ? '#f87171' : '#A78BFA', bg: over ? 'rgba(248, 113, 113, 0.10)' : 'rgba(167, 139, 250, 0.10)', border: over ? 'rgba(248, 113, 113, 0.20)' : 'rgba(167, 139, 250, 0.20)' },
    { label: 'Remaining', val: `₹${(budget?.remaining || 0).toLocaleString()}`, icon: TrendingUp, color: '#34d399', bg: 'rgba(52, 211, 153, 0.10)', border: 'rgba(52, 211, 153, 0.20)' },
    { label: 'Avg / Day', val: `₹${days ? ((budget?.totalSpent || 0) / days).toFixed(0) : 0}`, icon: DollarSign, color: '#F472B6', bg: 'rgba(244, 114, 182, 0.10)', border: 'rgba(244, 114, 182, 0.20)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}
    >
      <div>
        <span className="eyebrow"><Wallet style={{ width: '11px', height: '11px' }} /> Finances</span>
        <h1 className="font-display" style={{ fontSize: '34px', fontWeight: '800', color: '#f1f5f9', marginTop: '6px', letterSpacing: '-0.03em' }}>
          Budget <span className="text-gradient">Overview</span>
        </h1>
      </div>

      {over && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '14px 18px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#fca5a5', fontSize: '13px', fontWeight: 500,
          }}>
          <AlertCircle style={{ width: '17px', height: '17px' }} />
          You've exceeded your budget by <strong style={{ color: '#fff' }}>₹{(budget.totalSpent - budget.totalBudget).toFixed(2)}</strong>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="glass card-hover"
              style={{ padding: '22px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '11px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 18px ${s.bg}`,
                }}>
                  <Icon style={{ width: '17px', height: '17px', color: s.color }} />
                </div>
              </div>
              <p className="font-display" style={{ fontSize: '26px', fontWeight: '800', color: s.color, letterSpacing: '-0.02em' }}>{s.val}</p>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass" style={{ padding: '24px' }}>
          <h3 className="font-display" style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>Spending by Category</h3>
          <BudgetPieChart breakdown={budget?.breakdown} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass" style={{ padding: '24px' }}>
          <h3 className="font-display" style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>Budget vs Spent by Section</h3>
          <BudgetBarChart sections={budget?.sections} />
        </motion.div>
      </div>

      {budget?.sections?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass" style={{ padding: '24px' }}>
          <h3 className="font-display" style={{ fontWeight: '700', color: '#f1f5f9', marginBottom: '16px', fontSize: '16px' }}>Section Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {budget.sections.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  background: s.overBudget ? 'linear-gradient(135deg, rgba(239,68,68,0.10), rgba(239,68,68,0.02))' : 'rgba(15, 19, 36, 0.6)',
                  border: `1px solid ${s.overBudget ? 'rgba(239, 68, 68, 0.20)' : 'rgba(148, 163, 184, 0.08)'}`,
                  transition: 'all 0.2s',
                }}>
                <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: 600 }}>{s.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8' }}>Budget: <strong style={{ color: '#cbd5e1' }}>₹{s.budget}</strong></span>
                  <span style={{ color: s.overBudget ? '#f87171' : '#22D3EE', fontWeight: 600 }}>Spent: ₹{s.spent}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BudgetPage;
