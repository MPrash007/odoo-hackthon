import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, LayoutDashboard, Map, Users, Search, Bell, Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/trips', label: 'My Trips', icon: Map },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/search', label: 'Search', icon: Search },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
            }}>
              <Globe style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span style={{
              fontSize: '20px', fontWeight: '800',
              background: 'linear-gradient(135deg, #22D3EE, #06B6D4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Traveloop
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden md:flex">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '500',
                    textDecoration: 'none', transition: 'all 0.2s',
                    color: isActive ? '#22D3EE' : '#94a3b8',
                    background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.target.style.color = '#e2e8f0'; e.target.style.background = 'rgba(255,255,255,0.05)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.target.style.color = '#94a3b8'; e.target.style.background = 'transparent'; } }}
                >
                  <Icon style={{ width: '16px', height: '16px' }} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Notifications */}
            <button style={{
              position: 'relative', padding: '8px', borderRadius: '10px',
              background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8',
            }}>
              <Bell style={{ width: '18px', height: '18px' }} />
              <span style={{
                position: 'absolute', top: '6px', right: '6px',
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#06B6D4',
              }} />
            </button>

            {/* Profile */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '4px 8px', borderRadius: '10px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700', color: 'white',
                }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#cbd5e1' }} className="hidden sm:block">
                  {user.firstName}
                </span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    style={{
                      position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                      width: '200px', borderRadius: '14px', overflow: 'hidden',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.15)',
                      backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  >
                    <Link to="/profile" onClick={() => setProfileOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', fontSize: '13px', color: '#cbd5e1',
                      textDecoration: 'none', transition: 'background 0.2s',
                    }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <User style={{ width: '15px', height: '15px' }} /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px 16px', fontSize: '13px', color: '#cbd5e1',
                        textDecoration: 'none', transition: 'background 0.2s',
                      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                         onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Shield style={{ width: '15px', height: '15px' }} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '12px 16px', fontSize: '13px', color: '#f87171',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      textAlign: 'left', transition: 'background 0.2s',
                    }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)'}
                       onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogOut style={{ width: '15px', height: '15px' }} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              {mobileOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
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
            style={{ borderTop: '1px solid rgba(148, 163, 184, 0.08)', padding: '8px 16px' }}
          >
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px',
                    fontSize: '13px', fontWeight: '500', textDecoration: 'none',
                    color: isActive ? '#22D3EE' : '#94a3b8',
                    background: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                    marginBottom: '2px',
                  }}>
                  <Icon style={{ width: '16px', height: '16px' }} /> {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
