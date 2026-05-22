import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoSvg from '../assets/plane logo.png';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#F8FAFC',
    }}>
      {/* Left — Brand Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px)',
        background: 'linear-gradient(160deg, #2563EB, #7C3AED)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
      }} className="hidden lg:flex">
        {/* Decorative shapes */}
        <div className="animate-float-slow" style={{
          position: 'absolute', top: '-80px', right: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
        }} />
        <div className="animate-float" style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.20), transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '40px' }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
            }}>
              <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'white', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
              Traveloop
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(36px, 4vw, 48px)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-heading)',
              marginBottom: '18px',
            }}
          >
            Plan your next adventure with AI precision.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: '16px', color: 'rgba(255,255,255,0.80)', lineHeight: 1.6, maxWidth: '400px' }}
          >
            Create multi-city itineraries, track budgets, share with the community, and let AI plan your perfect trip.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '24px', marginTop: '40px' }}
          >
            {[
              { n: '10K+', l: 'Trips Planned' },
              { n: '120+', l: 'Cities' },
              { n: '4.9★', l: 'User Rating' },
            ].map(s => (
              <div key={s.l}>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>{s.n}</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', overflow: 'hidden' }}>
              <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="font-display" style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Traveloop</span>
          </div>

          <h2 className="font-display" style={{
            fontSize: '28px', fontWeight: 700, color: '#111827',
            marginBottom: '6px', letterSpacing: '-0.02em',
          }}>
            Welcome back
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '32px' }}>
            Sign in to continue planning your trips
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8', pointerEvents: 'none' }} />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-field input-with-icon"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94A3B8', pointerEvents: 'none' }} />
                <input
                  type="password" required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field input-with-icon"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <motion.button
              type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : <>Sign In <ArrowRight style={{ width: '16px', height: '16px' }} /></>}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '28px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '8px',
};

export default LoginPage;
