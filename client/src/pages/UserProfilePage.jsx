import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Save, Trash2, Languages } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { tripService } from '../services/tripService';
import TripCard from '../components/TripCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [p, t] = await Promise.all([authService.getMe(), tripService.getTrips()]);
        setProfile(p); setForm(p); setTrips(t);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await authService.updateMe({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, city: form.city, country: form.country, languagePreference: form.languagePreference, additionalInfo: form.additionalInfo });
      setProfile(updated); updateUser(updated); setEdit(false); toast.success('Saved!');
    } catch { toast.error('Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return;
    try { await authService.deleteMe(); logout(); navigate('/login'); toast.success('Account deleted'); } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSpinner />;

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const pastTrips = trips.filter(t => t.status === 'completed');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6 pb-10">
      <h1 className="text-3xl font-bold text-white">Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-3xl font-bold text-white mb-3">{profile?.firstName?.[0]}{profile?.lastName?.[0]}</div>
            <h2 className="text-xl font-bold text-white">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-sm text-slate-400">{profile?.email}</p>
          </div>
          {edit ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2"><input value={form.firstName || ''} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="First Name" /><input value={form.lastName || ''} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="Last Name" /></div>
              <input value={form.phone || ''} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="Phone" />
              <div className="grid grid-cols-2 gap-2"><input value={form.city || ''} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="City" /><input value={form.country || ''} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" placeholder="Country" /></div>
              <select value={form.languagePreference || 'en'} onChange={e => setForm(p => ({ ...p, languagePreference: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"><option value="en">English</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option></select>
              <div className="flex gap-2"><button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-lg bg-teal-500/15 text-teal-400 text-sm font-medium hover:bg-teal-500/25">{saving ? 'Saving...' : 'Save'}</button><button onClick={() => { setForm(profile); setEdit(false); }} className="flex-1 py-2 rounded-lg bg-white/5 text-slate-300 text-sm">Cancel</button></div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {profile?.phone && <p className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500" />{profile.phone}</p>}
              {(profile?.city || profile?.country) && <p className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-500" />{[profile.city, profile.country].filter(Boolean).join(', ')}</p>}
              <p className="flex items-center gap-2 text-slate-300"><Languages className="w-4 h-4 text-slate-500" />{profile?.languagePreference || 'en'}</p>
              <button onClick={() => setEdit(true)} className="w-full py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10 mt-2">Edit Profile</button>
            </div>
          )}
          <button onClick={handleDelete} className="w-full py-2 rounded-lg border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"><Trash2 className="w-3.5 h-3.5" />Delete Account</button>
        </div>

        {/* Trips */}
        <div className="lg:col-span-2 space-y-6">
          {upcomingTrips.length > 0 && (<div><h3 className="text-lg font-bold text-white mb-3">Upcoming Trips</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{upcomingTrips.map(t => <TripCard key={t._id} trip={t} onView={id => navigate(`/trips/${id}/itinerary`)} />)}</div></div>)}
          {pastTrips.length > 0 && (<div><h3 className="text-lg font-bold text-white mb-3">Previous Trips</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{pastTrips.map(t => <TripCard key={t._id} trip={t} onView={id => navigate(`/trips/${id}/itinerary`)} />)}</div></div>)}
          {trips.length === 0 && <div className="text-center py-16 glass rounded-2xl"><p className="text-slate-400">No trips yet. Start planning!</p></div>}
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfilePage;
