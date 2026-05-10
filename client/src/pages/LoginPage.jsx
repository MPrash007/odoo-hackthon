import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #070b14 0%, #0c2d48 40%, #0a1628 70%, #070b14 100%)',
    }}>
      {/* Animated blobs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', borderRadius: '50%' }} className="animate-float" />
      <div style={{ position: 'absolute', bottom: '-120px', left: '-120px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)', borderRadius: '50%', animationDelay: '1.5s' }} className="animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ position: 'relative', width: '100%', maxWidth: '420px' }}
      >
        <div style={{
          borderRadius: '24px', padding: '40px 36px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.05)',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 8px 30px rgba(6, 182, 212, 0.35)',
              }}
            >
              <Globe style={{ width: '32px', height: '32px', color: 'white' }} />
            </motion.div>
            <h1 className="text-gradient" style={{ fontSize: '26px', fontWeight: '800' }}>Traveloop</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Welcome back, explorer</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-field input-with-icon" placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-field input-with-icon" style={{ paddingRight: '44px' }} placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <a href="#" style={{ fontSize: '12px', color: '#06B6D4', textDecoration: 'none' }}>Forgot Password?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Signing in...' : 'Login'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#22D3EE', fontWeight: '500', textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
