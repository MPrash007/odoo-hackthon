import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users as UsersIcon, Map, TrendingUp, Trash2, Search } from 'lucide-react';
import { adminService } from '../services/budgetService';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'admin') { toast.error('Access Denied'); navigate('/dashboard'); return; }
    const load = async () => {
      try {
        const [s, u, t] = await Promise.all([adminService.getStats(), adminService.getUsers(), adminService.getAllTrips()]);
        setStats(s); setUsers(u); setTrips(t);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await adminService.deleteUser(id); setUsers(p => p.filter(u => u._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: 'from-blue-400 to-blue-600' },
    { label: 'Total Trips', value: stats?.totalTrips || 0, icon: Map, color: 'from-teal-400 to-teal-600' },
    { label: 'Popular City', value: stats?.popularCity || 'N/A', icon: TrendingUp, color: 'from-purple-400 to-purple-600' },
    { label: 'Public Trips', value: stats?.publicTrips || 0, icon: Shield, color: 'from-amber-400 to-amber-600' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Shield className="w-7 h-7 text-teal-400" />Admin Dashboard</h1>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => { const Icon = s.icon; return (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
            <div><p className="text-xs text-slate-400">{s.label}</p><p className="text-xl font-bold text-white">{s.value}</p></div>
          </motion.div>
        ); })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5"><h3 className="font-bold text-white mb-4">Trips Over Time</h3>
          <ResponsiveContainer width="100%" height={220}><LineChart data={stats?.tripsByMonth || []}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="_id" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4' }} /></LineChart></ResponsiveContainer>
        </div>
        <div className="glass rounded-2xl p-5"><h3 className="font-bold text-white mb-4">Top Cities</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={stats?.topCities || []}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="_id" tick={{ fill: '#94a3b8', fontSize: 11 }} /><YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">{['overview', 'users', 'trips'].map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-slate-400'}`}>{t}</button>)}</div>

      {tab === 'users' && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm"><thead><tr className="border-b border-white/10"><th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th><th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th><th className="text-left px-4 py-3 text-slate-400 font-medium">Role</th><th className="px-4 py-3"></th></tr></thead>
            <tbody>{users.map(u => (<tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]"><td className="px-4 py-3 text-white">{u.firstName} {u.lastName}</td><td className="px-4 py-3 text-slate-400">{u.email}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-teal-500/20 text-teal-400'}`}>{u.role}</span></td><td className="px-4 py-3"><button onClick={() => deleteUser(u._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-3.5 h-3.5" /></button></td></tr>))}</tbody>
          </table>
        </div>
      )}

      {tab === 'trips' && (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm"><thead><tr className="border-b border-white/10"><th className="text-left px-4 py-3 text-slate-400 font-medium">Title</th><th className="text-left px-4 py-3 text-slate-400 font-medium">User</th><th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th><th className="text-left px-4 py-3 text-slate-400 font-medium">Public</th></tr></thead>
            <tbody>{trips.map(t => (<tr key={t._id} className="border-b border-white/5 hover:bg-white/[0.02]"><td className="px-4 py-3 text-white">{t.title}</td><td className="px-4 py-3 text-slate-400">{t.user?.firstName} {t.user?.lastName}</td><td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${t.status === 'ongoing' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'}`}>{t.status}</span></td><td className="px-4 py-3 text-slate-400">{t.isPublic ? '✓' : '—'}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboardPage;
