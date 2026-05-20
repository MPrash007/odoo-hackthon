import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Search, CheckSquare, FileText, PieChart, Shield, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/trips', label: 'My Trips', icon: Map },
    { to: '/search', label: 'Discover', icon: Search },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/chat', label: 'Messages', icon: MessageCircle },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 glass border-r border-white/5 p-4 z-40">
      <div className="space-y-1 flex-1">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-teal-500/15 text-teal-400 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {link.label}
            </NavLink>
          );
        })}
      </div>
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-slate-500 text-center">© 2024 Traveloop</p>
      </div>
    </aside>
  );
};

export default Sidebar;
