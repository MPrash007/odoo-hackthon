import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Search, Users, Sparkles, MessageCircle, User, Settings } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'My Trips', icon: Map },
  { to: '/search', label: 'Discover', icon: Search },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/chat', label: 'Chats', icon: MessageCircle },
  { to: '/ai-planner', label: 'AI Planner', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar = () => (
  <aside style={{
    position: 'fixed',
    left: 0,
    top: '68px',
    bottom: 0,
    width: '240px',
    background: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
    zIndex: 40,
  }}>
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '11px 16px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: isActive ? '600' : '400',
          color: isActive ? '#2563EB' : '#64748B',
          background: isActive ? 'rgba(37, 99, 235, 0.06)' : 'transparent',
          border: `1px solid ${isActive ? 'rgba(37, 99, 235, 0.12)' : 'transparent'}`,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        })}
      >
        <Icon style={{ width: '18px', height: '18px' }} />
        {label}
      </NavLink>
    ))}
  </aside>
);

export default Sidebar;
