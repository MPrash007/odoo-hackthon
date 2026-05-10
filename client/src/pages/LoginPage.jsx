import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Plane, MapPin, Sparkles } from 'lucide-react';
import logoSvg from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.10), transparent 70%), linear-gradient(180deg, #050816 0%, #07091a 100%)',
    }}>
      {/* Left brand panel (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex"
        style={{
          flex: 1.1, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #0b1027 0%, #11163a 50%, #1a0f2e 100%)',
        }}
      >
        {/* Aurora orbs */}
        <div className="animate-float-slow" style={{ position: 'absolute', top: '-80px', right: '-60px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.30), transparent 70%)' }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '-100px', left: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)', animationDelay: '1.5s' }} />
        <div className="animate-float-slow" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.18), transparent 70%)', animationDelay: '0.8s' }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', width: 'fit-content' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(6, 182, 212, 0.40)',
            }}>
              <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="font-display animate-gradient-text" style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Traveloop</span>
          </Link>

          {/* Hero text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="eyebrow"
            >
              <Sparkles style={{ width: '12px', height: '12px' }} /> Your travel co-pilot
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="font-display"
              style={{
                fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: '800',
                color: '#f1f5f9', lineHeight: 1.05, letterSpacing: '-0.03em',
                marginTop: '14px', marginBottom: '20px',
              }}
            >
              Plan your<br />
              <span className="text-gradient">next adventure</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '440px' }}
            >
              Build multi-city itineraries, track budgets in real-time, and share unforgettable journeys with a community of explorers.
            </motion.p>
          </div>

          {/* Mini features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}
          >
            {[
              { icon: Plane, label: 'Smart itineraries' },
              { icon: MapPin, label: '120+ cities' },
              { icon: Sparkles, label: 'Community trips' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'rgba(6, 182, 212, 0.10)', border: '1px solid rgba(6, 182, 212, 0.20)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: '14px', height: '14px', color: '#22D3EE' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 500 }}>{f.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', position: 'relative',
      }}>
        {/* Mobile orbs */}
        <div className="lg:hidden animate-float-slow" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.16), transparent 70%)' }} />
        <div className="lg:hidden animate-float" style={{ position: 'absolute', bottom: '-120px', left: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ position: 'relative', width: '100%', maxWidth: '440px' }}
        >
          <div className="gradient-border" style={{ padding: '44px 36px' }}>
            {/* Mobile logo */}
            <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  boxShadow: '0 10px 30px rgba(6, 182, 212, 0.40)',
                }}
              >
                <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
              <h1 className="font-display animate-gradient-text" style={{ fontSize: '24px', fontWeight: '800' }}>Traveloop</h1>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <span className="eyebrow"><Sparkles style={{ width: '11px', height: '11px' }} /> Welcome back</span>
              <h1 className="font-display" style={{ fontSize: '28px', fontWeight: '800', color: '#f1f5f9', marginTop: '10px', letterSpacing: '-0.02em' }}>
                Sign in to your account
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>Continue planning your next escape.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={iconStyle} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-field input-with-icon" placeholder="you@example.com" autoComplete="email"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="input-field input-with-icon" style={{ paddingRight: '44px' }} placeholder="••••••••" autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#22D3EE', width: '14px', height: '14px' }} /> Remember me
                </label>
                <a href="#" style={{ fontSize: '12px', color: '#22D3EE', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                type="submit" disabled={loading}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? 'Signing in...' : <>Sign In <ArrowRight style={{ width: '15px', height: '15px' }} /></>}
              </motion.button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div className="divider" style={{ flex: 1 }} />
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500, letterSpacing: '0.08em' }}>OR</span>
              <div className="divider" style={{ flex: 1 }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
              New to Traveloop?{' '}
              <Link to="/register" style={{ color: '#22D3EE', fontWeight: '600', textDecoration: 'none' }}>Create an account →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px', letterSpacing: '0.01em' };
const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none' };

export default LoginPage;
