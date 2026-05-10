import { motion } from 'framer-motion';
import { Calendar, MapPin, Eye, Edit, Trash2, ArrowUpRight } from 'lucide-react';
import { formatDateRange } from '../utils/formatDate';

const statusStyles = {
  ongoing: { bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.20), rgba(16, 185, 129, 0.05))', color: '#34d399', border: 'rgba(16, 185, 129, 0.35)', glow: 'rgba(16, 185, 129, 0.30)' },
  upcoming: { bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.20), rgba(59, 130, 246, 0.05))', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.35)', glow: 'rgba(59, 130, 246, 0.30)' },
  completed: { bg: 'linear-gradient(135deg, rgba(100, 116, 139, 0.20), rgba(100, 116, 139, 0.05))', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.30)', glow: 'rgba(100, 116, 139, 0.20)' },
};

const TripCard = ({ trip, onView, onEdit, onDelete }) => {
  const status = statusStyles[trip.status] || statusStyles.upcoming;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      style={{
        position: 'relative',
        borderRadius: '20px', overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(31, 42, 68, 0.55), rgba(10, 14, 28, 0.85))',
        border: '1px solid rgba(148, 163, 184, 0.10)',
        cursor: 'pointer',
      }}
      className="card-hover group"
    >
      {/* Subtle gradient overlay on hover */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0) 0%, rgba(139, 92, 246, 0) 100%)',
        opacity: 0,
        transition: 'opacity 0.4s ease',
      }} className="group-hover:opacity-100" />

      {/* Cover */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
          alt={trip.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
          className="group-hover:scale-110"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8, 12, 28, 0.95) 0%, rgba(8, 12, 28, 0.30) 50%, transparent 100%)',
        }} />
        {/* Decorative shine on hover */}
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%',
          background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.10), transparent)',
          transform: 'skewX(-20deg)',
          transition: 'left 0.7s ease',
        }} className="group-hover:[left:130%]" />

        <span style={{
          position: 'absolute', top: '14px', right: '14px',
          padding: '5px 12px', borderRadius: '999px',
          fontSize: '10px', fontWeight: '700',
          background: status.bg, color: status.color,
          border: `1px solid ${status.border}`,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          boxShadow: `0 0 16px ${status.glow}`,
          backdropFilter: 'blur(8px)',
        }}>
          {trip.status}
        </span>

        {/* Destinations chip */}
        {trip.destinations?.length > 0 && (
          <div style={{
            position: 'absolute', bottom: '14px', left: '14px', right: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', color: '#cbd5e1',
          }}>
            <MapPin style={{ width: '12px', height: '12px', color: '#22D3EE' }} />
            <span style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              fontWeight: 500,
            }}>
              {trip.destinations.slice(0, 2).join(' · ')}
              {trip.destinations.length > 2 && ` +${trip.destinations.length - 2}`}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', padding: '18px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <h3 className="font-display" style={{
            fontSize: '17px', fontWeight: '700', color: '#f1f5f9',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            letterSpacing: '-0.01em', flex: 1,
          }}>
            {trip.title}
          </h3>
          <ArrowUpRight style={{ width: '16px', height: '16px', color: '#475569', flexShrink: 0, transition: 'all 0.3s ease' }} className="group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar style={{ width: '13px', height: '13px', color: '#64748b' }} />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#475569' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin style={{ width: '13px', height: '13px', color: '#64748b' }} />
            {trip.destinations?.length || 0} {trip.destinations?.length === 1 ? 'city' : 'cities'}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => { e.stopPropagation(); onView?.(trip._id); }}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px', borderRadius: '11px', fontSize: '12px', fontWeight: '600',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.10))',
              color: '#22D3EE',
              border: '1px solid rgba(6, 182, 212, 0.25)', cursor: 'pointer',
              transition: 'all 0.2s', letterSpacing: '0.01em',
            }}
          >
            <Eye style={{ width: '14px', height: '14px' }} /> View
          </motion.button>
          {onEdit && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={(e) => { e.stopPropagation(); onEdit?.(trip._id); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '9px', borderRadius: '11px', fontSize: '12px', fontWeight: '600',
                background: 'rgba(148, 163, 184, 0.06)', color: '#cbd5e1',
                border: '1px solid rgba(148, 163, 184, 0.10)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Edit style={{ width: '14px', height: '14px' }} /> Edit
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.05 }}
              onClick={(e) => { e.stopPropagation(); onDelete?.(trip._id); }}
              style={{
                padding: '9px', borderRadius: '11px',
                background: 'rgba(248, 113, 113, 0.05)', color: '#94a3b8',
                border: '1px solid rgba(148, 163, 184, 0.10)', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.30)'; e.currentTarget.style.background = 'rgba(248, 113, 113, 0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.10)'; e.currentTarget.style.background = 'rgba(248, 113, 113, 0.05)'; }}
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
