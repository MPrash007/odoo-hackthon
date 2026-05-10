import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Camera, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', city: '', country: '', additionalInfo: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try { await register(form); toast.success('Welcome to Traveloop! 🌍'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '500', color: '#94a3b8', marginBottom: '6px' };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #070b14 0%, #0c2d48 40%, #0a1628 70%, #070b14 100%)',
    }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', borderRadius: '50%' }} className="animate-float" />
      <div style={{ position: 'absolute', bottom: '-120px', left: '-120px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)', borderRadius: '50%' }} className="animate-float" />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ position: 'relative', width: '100%', maxWidth: '520px' }}>
        <div style={{
          borderRadius: '24px', padding: '36px 32px',
          background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(148, 163, 184, 0.12)',
          backdropFilter: 'blur(24px)', boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #06B6D4, #0891B2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', boxShadow: '0 8px 30px rgba(6,182,212,0.35)' }}>
              <Globe style={{ width: '28px', height: '28px', color: 'white' }} />
            </motion.div>
            <h1 className="text-gradient" style={{ fontSize: '24px', fontWeight: '800' }}>Create Account</h1>
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>Start your travel journey</p>
          </div>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(30, 41, 59, 0.8)', border: '2px dashed rgba(148,163,184,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User style={{ width: '28px', height: '28px', color: '#475569' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '26px', height: '26px', borderRadius: '50%', background: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(6,182,212,0.4)' }}>
                <Camera style={{ width: '12px', height: '12px', color: 'white' }} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div><label style={labelStyle}>First Name *</label><input value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-field" placeholder="John" /></div>
              <div><label style={labelStyle}>Last Name *</label><input value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-field" placeholder="Doe" /></div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Email *</label>
              <div style={{ position: 'relative' }}><Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} /><input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field input-with-icon" placeholder="you@example.com" /></div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Password *</label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="input-field" placeholder="Min 6 characters" />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Phone</label>
              <div style={{ position: 'relative' }}><Phone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} /><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field input-with-icon" placeholder="+1 234 567 890" /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div><label style={labelStyle}>City</label><div style={{ position: 'relative' }}><MapPin style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' }} /><input value={form.city} onChange={e => update('city', e.target.value)} className="input-field input-with-icon" placeholder="New York" /></div></div>
              <div><label style={labelStyle}>Country</label><input value={form.country} onChange={e => update('country', e.target.value)} className="input-field" placeholder="USA" /></div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Additional Info</label>
              <textarea value={form.additionalInfo} onChange={e => update('additionalInfo', e.target.value)} rows={2} className="input-field" style={{ resize: 'none' }} placeholder="Travel interests..." />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating account...' : 'Register'}
            </motion.button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '20px' }}>
            Already have an account? <Link to="/login" style={{ color: '#22D3EE', fontWeight: '500', textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
