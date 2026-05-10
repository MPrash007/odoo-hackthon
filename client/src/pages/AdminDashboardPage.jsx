import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users as UsersIcon, Map, TrendingUp, Trash2, Sparkles } from 'lucide-react';
import { adminService } from '../services/budgetService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.10)', border: 'rgba(34, 211, 238, 0.20)' },
    { label: 'Total Trips', value: stats?.totalTrips || 0, icon: Map, color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.10)', border: 'rgba(167, 139, 250, 0.20)' },
    { label: 'Popular City', value: stats?.popularCity || 'N/A', icon: TrendingUp, color: '#F472B6', bg: 'rgba(244, 114, 182, 0.10)', border: 'rgba(244, 114, 182, 0.20)' },
    { label: 'Public Trips', value: stats?.publicTrips || 0, icon: Shield, color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.10)', border: 'rgba(251, 191, 36, 0.20)' },
  ];

  const tabStyle = (active) => ({
    padding: '9px 18px', borderRadius: '11px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize',
    background: active ? 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(139,92,246,0.12))' : 'rgba(148,163,184,0.06)',
    color: active ? '#22D3EE' : '#94a3b8',
    border: `1px solid ${active ? 'rgba(6,182,212,0.30)' : 'rgba(148,163,184,0.10)'}`,
    transition: 'all 0.2s',
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '60px' }}>

      <div>
        <span className="eyebrow"><Shield style={{ width: '11px', height: '11px' }} /> Admin Panel</span>
        <h1 className="font-display" style={{ fontSize: '34px', fontWeight: '800', color: '#f1f5f9', marginTop: '6px', letterSpacing: '-0.03em' }}>
          Admin <span className="text-gradient-warm">Dashboard</span>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass card-hover"
              style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <div style={{
                width: '50px', height: '50px', borderRadius: '14px',
                background: s.bg, border: `1px solid ${s.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 24px ${s.bg}`,
              }}>
                <Icon style={{ width: '22px', height: '22px', color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
                <p className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: '#f1f5f9', marginTop: '2px', letterSpacing: '-0.02em' }}>{s.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        <div className="glass" style={{ padding: '22px' }}>
          <h3 className="font-display" style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '14px' }}>Trips Over Time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats?.tripsByMonth || []}>
              <defs>
                <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22D3EE" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="_id" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.10)' }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.10)' }} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10, 14, 28, 0.95)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '10px' }} />
              <Line type="monotone" dataKey="count" stroke="url(#lineColor)" strokeWidth={3} dot={{ fill: '#22D3EE', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass" style={{ padding: '22px' }}>
          <h3 className="font-display" style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9', marginBottom: '14px' }}>Top Cities</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats?.topCities || []}>
              <defs>
                <linearGradient id="adminBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="_id" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.10)' }} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.10)' }} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(10, 14, 28, 0.95)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: '10px' }} cursor={{ fill: 'rgba(148, 163, 184, 0.04)' }} />
              <Bar dataKey="count" fill="url(#adminBar)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['overview', 'users', 'trips'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(tab === t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.10)', background: 'rgba(10, 14, 28, 0.4)' }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: '#f1f5f9', fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                    <td style={{ ...tdStyle, color: '#94a3b8' }}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                        background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 211, 238, 0.10)',
                        color: u.role === 'admin' ? '#fbbf24' : '#22D3EE',
                        border: `1px solid ${u.role === 'admin' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(34, 211, 238, 0.20)'}`,
                      }}>{u.role}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button onClick={() => deleteUser(u._id)}
                        style={{ padding: '6px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248, 113, 113, 0.10)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}>
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'trips' && (
        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.10)', background: 'rgba(10, 14, 28, 0.4)' }}>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Public</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(t => (
                  <tr key={t._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.05)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: '#f1f5f9', fontWeight: 500 }}>{t.title}</td>
                    <td style={{ ...tdStyle, color: '#94a3b8' }}>{t.user?.firstName} {t.user?.lastName}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                        background: t.status === 'ongoing' ? 'rgba(16, 185, 129, 0.15)' : t.status === 'upcoming' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                        color: t.status === 'ongoing' ? '#34d399' : t.status === 'upcoming' ? '#60a5fa' : '#94a3b8',
                        border: `1px solid ${t.status === 'ongoing' ? 'rgba(16, 185, 129, 0.30)' : t.status === 'upcoming' ? 'rgba(59, 130, 246, 0.30)' : 'rgba(100, 116, 139, 0.30)'}`,
                        textTransform: 'capitalize',
                      }}>{t.status}</span>
                    </td>
                    <td style={{ ...tdStyle, color: t.isPublic ? '#34d399' : '#475569' }}>{t.isPublic ? '✓ Yes' : '— No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'overview' && (
        <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
          <Sparkles style={{ width: '36px', height: '36px', color: '#475569', margin: '0 auto 14px' }} />
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Use the tabs above to manage users and trips.</p>
        </div>
      )}
    </motion.div>
  );
};

const thStyle = { textAlign: 'left', padding: '14px 18px', color: '#94a3b8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em' };
const tdStyle = { padding: '14px 18px' };

export default AdminDashboardPage;
