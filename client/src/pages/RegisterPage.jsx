import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, User, Mail, Phone, MapPin, ArrowRight, Sparkles, Plane, Compass, Loader2, Lock, Globe } from 'lucide-react';
import logoSvg from '../assets/plane logo.png';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', city: '', country: '', additionalInfo: '', profilePhoto: '' });
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const API = import.meta.env.VITE_API_BASE_URL || '/api';
      const { data } = await axios.post(`${API}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      update('profilePhoto', data.url);
      toast.success('Photo uploaded!');
    } catch (err) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return toast.error('Please fill required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try { await register(form); toast.success('Welcome to Traveloop!'); navigate('/dashboard'); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.12), transparent 70%), linear-gradient(180deg, #050816 0%, #07091a 100%)',
    }}>
      {/* Left brand panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
        className="hidden lg:flex"
        style={{
          flex: 1.1, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a0f2e 0%, #11163a 50%, #0b1027 100%)',
        }}
      >
        <div className="animate-float-slow" style={{ position: 'absolute', top: '-100px', left: '-80px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent 70%)' }} />
        <div className="animate-float" style={{ position: 'absolute', bottom: '-100px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.22), transparent 70%)', animationDelay: '1.2s' }} />
        <div className="animate-float-slow" style={{ position: 'absolute', top: '40%', right: '20%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.20), transparent 70%)', animationDelay: '0.6s' }} />

        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', width: 'fit-content' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.40)',
            }}>
              <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="font-display animate-gradient-text" style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>Traveloop</span>
          </Link>

          <div>
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="eyebrow">
              <Sparkles style={{ width: '12px', height: '12px' }} /> Join 50K+ travelers
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
              Start your<br />
              <span className="text-gradient-warm">journey today</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7, maxWidth: '440px' }}
            >
              Create an account and unlock smart trip planning, real-time budget tracking, packing lists, and a community of explorers.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: Plane, label: 'Free forever' },
              { icon: Compass, label: 'No credit card' },
              { icon: Sparkles, label: 'Cancel anytime' },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'rgba(236, 72, 153, 0.10)', border: '1px solid rgba(236, 72, 153, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon style={{ width: '14px', height: '14px', color: '#F472B6' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 500 }}>{f.label}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative' }}>
        <div className="lg:hidden animate-float-slow" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.16), transparent 70%)' }} />
        <div className="lg:hidden animate-float" style={{ position: 'absolute', bottom: '-120px', left: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ position: 'relative', width: '100%', maxWidth: '520px' }}
        >
          <div className="gradient-border" style={{ padding: '36px 32px' }}>
            <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }}
                style={{ width: '52px', height: '52px', borderRadius: '14px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 10px 30px rgba(139,92,246,0.4)' }}>
                <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <span className="eyebrow"><Sparkles style={{ width: '11px', height: '11px' }} /> Get started</span>
              <h1 className="font-display" style={{ fontSize: '26px', fontWeight: '800', color: '#f1f5f9', marginTop: '10px', letterSpacing: '-0.02em' }}>
                Create your account
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>It only takes a minute.</p>
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <motion.div whileHover={{ scale: 1.05 }} style={{ position: 'relative' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '76px', height: '76px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(139, 92, 246, 0.10))',
                    border: '2px dashed rgba(148, 163, 184, 0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', cursor: 'pointer',
                  }}
                >
                  {uploadingPhoto ? (
                    <Loader2 className="animate-spin" style={{ width: '28px', height: '28px', color: '#22D3EE' }} />
                  ) : form.profilePhoto ? (
                    <img src={form.profilePhoto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User style={{ width: '28px', height: '28px', color: '#475569' }} />
                  )}
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.40)',
                    border: '2px solid #050816',
                  }}
                >
                  <Camera style={{ width: '13px', height: '13px', color: 'white' }} />
                </div>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User style={iconStyle} />
                    <input value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-field input-with-icon" placeholder="John" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User style={iconStyle} />
                    <input value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-field input-with-icon" placeholder="Doe" />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Email *</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={iconStyle} />
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field input-with-icon" placeholder="you@example.com" />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="input-field input-with-icon" placeholder="Min 6 characters" />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={iconStyle} />
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field input-with-icon" placeholder="+91 9876543210" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin style={iconStyle} />
                    <input value={form.city} onChange={e => update('city', e.target.value)} className="input-field input-with-icon" placeholder="Delhi" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <div style={{ position: 'relative' }}>
                    <Globe style={iconStyle} />
                    <input value={form.country} onChange={e => update('country', e.target.value)} className="input-field input-with-icon" placeholder="INDIA" />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Travel interests (optional)</label>
                <textarea value={form.additionalInfo} onChange={e => update('additionalInfo', e.target.value)} rows={2} className="input-field" style={{ resize: 'none' }} placeholder="Beach, hiking, food, history..." />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                type="submit" disabled={loading} className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loading ? 'Creating account...' : <>Create Account <ArrowRight style={{ width: '15px', height: '15px' }} /></>}
              </motion.button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#94a3b8', marginTop: '20px' }}>
              Already have an account? <Link to="/login" style={{ color: '#22D3EE', fontWeight: '600', textDecoration: 'none' }}>Sign in →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' };
const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: '#64748b', pointerEvents: 'none', zIndex: 10 };

export default RegisterPage;
