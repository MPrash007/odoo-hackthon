import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, Users, Search, Bell, Menu, X, LogOut, User, Shield, Sparkles, MessageCircle } from 'lucide-react';
import logoSvg from '../assets/plane logo.png';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/trips', label: 'My Trips', icon: Map },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/search', label: 'Discover', icon: Search },
    { path: '/chat', label: 'Chats', icon: MessageCircle },
    { path: '/ai-planner', label: 'AI Planner', icon: Sparkles },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isActiveLink = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(5, 8, 22, 0.75)' : 'rgba(5, 8, 22, 0.40)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderBottom: scrolled ? '1px solid rgba(148, 163, 184, 0.10)' : '1px solid transparent',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <motion.div
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                position: 'relative',
                width: '38px', height: '38px', borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.40), 0 4px 14px rgba(139, 92, 246, 0.20)',
              }}
            >
              <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#22D3EE',
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)',
              }} className="animate-pulse-glow" />
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span className="font-display animate-gradient-text" style={{
                fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em',
              }}>
                Traveloop
              </span>
              <span style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
                Plan · Explore · Share
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.path);
              const isAiLink = link.path === '/ai-planner';
              
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    position: 'relative',
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '9px 16px', borderRadius: '12px',
                    fontSize: '13px', fontWeight: '500',
                    textDecoration: 'none', transition: 'all 0.25s ease',
                    color: isActive ? '#22D3EE' : (isAiLink ? '#67e8f9' : '#94a3b8'),
                    ...(isAiLink && !isActive ? { textShadow: '0 0 8px rgba(6, 182, 212, 0.4)' } : {})
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = isAiLink ? '#22D3EE' : '#e2e8f0'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = isAiLink ? '#67e8f9' : '#94a3b8'; }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(139, 92, 246, 0.18))',
                        border: '1px solid rgba(6, 182, 212, 0.30)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(6, 182, 212, 0.20)',
                      }}
                    />
                  )}
                  <Icon style={{ width: '15px', height: '15px', position: 'relative', zIndex: 1, ...(isAiLink ? { color: '#06B6D4' } : {}) }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Quick action */}
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/trips/new')}
              className="hidden sm:flex"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0891B2, #06B6D4, #8B5CF6)',
                color: 'white', fontSize: '12px', fontWeight: '600',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)',
              }}
            >
              <Sparkles style={{ width: '13px', height: '13px' }} /> New Trip
            </motion.button>

            {/* Notifications */}
            <button style={{
              position: 'relative', padding: '9px', borderRadius: '12px',
              background: 'rgba(148, 163, 184, 0.06)', border: '1px solid rgba(148, 163, 184, 0.08)',
              cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148, 163, 184, 0.12)'; e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)'; e.currentTarget.style.color = '#94a3b8'; }}>
              <Bell style={{ width: '16px', height: '16px' }} />
              <span style={{
                position: 'absolute', top: '7px', right: '7px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#EC4899',
                boxShadow: '0 0 8px rgba(236, 72, 153, 0.8)',
              }} />
            </button>

            {/* Profile */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '4px 10px 4px 4px', borderRadius: '999px',
                  background: 'rgba(148, 163, 184, 0.06)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148, 163, 184, 0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148, 163, 184, 0.06)'; }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: 'white',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.30)',
                }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }} className="hidden sm:block">
                  {user.firstName}
                </span>
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute', right: 0, top: '100%', marginTop: '12px',
                      width: '230px', borderRadius: '16px', overflow: 'hidden',
                      background: 'rgba(10, 14, 28, 0.92)',
                      border: '1px solid rgba(148, 163, 184, 0.12)',
                      backdropFilter: 'blur(28px) saturate(160%)',
                      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(6, 182, 212, 0.04)',
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      padding: '16px',
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08))',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
                    }}>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{user.email}</p>
                    </div>
                    <div style={{ padding: '6px' }}>
                      <Link to="/profile" style={menuItemStyle}>
                        <User style={{ width: '15px', height: '15px' }} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" style={menuItemStyle}>
                          <Shield style={{ width: '15px', height: '15px' }} /> Admin Panel
                        </Link>
                      )}
                      <div className="divider" style={{ margin: '6px 0' }} />
                      <button onClick={handleLogout} style={{ ...menuItemStyle, color: '#f87171', width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}>
                        <LogOut style={{ width: '15px', height: '15px' }} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                padding: '9px', borderRadius: '12px',
                background: 'rgba(148, 163, 184, 0.06)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
                cursor: 'pointer', color: '#e2e8f0',
              }}>
              {mobileOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{
              borderTop: '1px solid rgba(148, 163, 184, 0.08)',
              padding: '12px 16px',
              background: 'rgba(5, 8, 22, 0.85)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.path);
              return (
                <motion.div key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link to={link.path}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 14px', borderRadius: '12px',
                      fontSize: '14px', fontWeight: '500', textDecoration: 'none',
                      color: isActive ? '#22D3EE' : '#cbd5e1',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.10))'
                        : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(6,182,212,0.25)' : 'transparent'}`,
                      marginBottom: '4px',
                    }}>
                    <Icon style={{ width: '17px', height: '17px' }} /> {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 12px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#cbd5e1',
  textDecoration: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background 0.18s ease, color 0.18s ease',
};

export default Navbar;
