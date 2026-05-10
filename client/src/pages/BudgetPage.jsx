import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2"><DollarSign className="w-7 h-7 text-teal-400" />Budget Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: 'Total Budget', val: `$${budget?.totalBudget || 0}`, color: 'text-white' }, { label: 'Spent', val: `$${budget?.totalSpent || 0}`, color: over ? 'text-red-400' : 'text-teal-400' }, { label: 'Remaining', val: `$${budget?.remaining || 0}`, color: 'text-white' }, { label: 'Avg/Day', val: `$${days ? ((budget?.totalSpent || 0) / days).toFixed(0) : 0}`, color: 'text-white' }].map(s => (
          <div key={s.label} className="glass rounded-xl p-4"><p className="text-xs text-slate-400">{s.label}</p><p className={`text-2xl font-bold ${s.color}`}>{s.val}</p></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5"><h3 className="font-bold text-white mb-4">Spending by Category</h3><BudgetPieChart breakdown={budget?.breakdown} /></div>
        <div className="glass rounded-2xl p-5"><h3 className="font-bold text-white mb-4">Budget vs Spent by Section</h3><BudgetBarChart sections={budget?.sections} /></div>
      </div>
      {budget?.sections?.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Section Details</h3>
          <div className="space-y-2">
            {budget.sections.map((s, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl ${s.overBudget ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/[0.03] border border-white/5'}`}>
                <span className="text-sm text-white font-medium">{s.title}</span>
                <div className="flex items-center gap-4 text-sm"><span className="text-slate-400">Budget: ${s.budget}</span><span className={s.overBudget ? 'text-red-400' : 'text-teal-400'}>Spent: ${s.spent}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BudgetPage;
