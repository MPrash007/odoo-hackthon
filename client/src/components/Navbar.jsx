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
        background: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(248, 250, 252, 0.60)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderBottom: scrolled ? '1px solid #E2E8F0' : '1px solid transparent',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                position: 'relative',
                width: '38px', height: '38px', borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.20)',
              }}
            >
              <img src={logoSvg} alt="Traveloop" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span className="font-display" style={{
                fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em',
                color: '#111827',
              }}>
                Traveloop
              </span>
              <span style={{ fontSize: '9px', color: '#64748B', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>
                Plan · Explore · Share
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden md:flex">
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
                    color: isActive ? '#2563EB' : (isAiLink ? '#7C3AED' : '#64748B'),
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = isAiLink ? '#7C3AED' : '#111827'; e.currentTarget.style.background = '#F1F5F9'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = isAiLink ? '#7C3AED' : '#64748B'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.15)',
                        borderRadius: '12px',
                      }}
                    />
                  )}
                  <Icon style={{ width: '15px', height: '15px', position: 'relative', zIndex: 1 }} />
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
                background: '#2563EB',
                color: 'white', fontSize: '12px', fontWeight: '600',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Sparkles style={{ width: '13px', height: '13px' }} /> New Trip
            </motion.button>

            {/* Notifications */}
            <button style={{
              position: 'relative', padding: '9px', borderRadius: '12px',
              background: 'transparent', border: '1px solid transparent',
              cursor: 'pointer', color: '#64748B', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#111827'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}>
              <Bell style={{ width: '16px', height: '16px' }} />
              <span style={{
                position: 'absolute', top: '7px', right: '7px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#2563EB',
                boxShadow: '0 0 6px rgba(37, 99, 235, 0.6)',
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
                  background: 'transparent',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: 'white',
                }}>
                  {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }} className="hidden sm:block">
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
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 20px 60px rgba(17, 24, 39, 0.12), 0 8px 20px rgba(17, 24, 39, 0.06)',
                    }}
                  >
                    {/* Header */}
                    <div style={{
                      padding: '16px',
                      background: '#F8FAFC',
                      borderBottom: '1px solid #E2E8F0',
                    }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {user.firstName} {user.lastName}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{user.email}</p>
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
                      <button onClick={handleLogout} style={{ ...menuItemStyle, color: '#DC2626', width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}>
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
                background: 'transparent',
                border: '1px solid #E2E8F0',
                cursor: 'pointer', color: '#111827',
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
              borderTop: '1px solid #E2E8F0',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.95)',
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
                      color: isActive ? '#2563EB' : '#374151',
                      background: isActive ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent'}`,
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
  color: '#374151',
  textDecoration: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background 0.18s ease, color 0.18s ease',
};

export default Navbar;
