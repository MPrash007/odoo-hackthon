import { motion } from 'framer-motion';
import { Clock, DollarSign, Star, MapPin, Plus } from 'lucide-react';

const typeColors = {
  sightseeing: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: 'rgba(245,158,11,0.30)', tag: 'rgba(245, 158, 11, 0.10)', tagColor: '#fbbf24' },
  food: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239,68,68,0.30)', tag: 'rgba(239, 68, 68, 0.10)', tagColor: '#fca5a5' },
  adventure: { bg: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.30)', tag: 'rgba(16, 185, 129, 0.10)', tagColor: '#34d399' },
  culture: { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: 'rgba(139,92,246,0.35)', tag: 'rgba(139, 92, 246, 0.10)', tagColor: '#a78bfa' },
  relaxation: { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: 'rgba(59,130,246,0.30)', tag: 'rgba(59, 130, 246, 0.10)', tagColor: '#60a5fa' },
};

const ActivityCard = ({ activity, onAdd }) => {
  const colors = typeColors[activity.type] || typeColors.sightseeing;

  return (
    <motion.div whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{
        position: 'relative',
        borderRadius: '16px', overflow: 'hidden',
        background: 'linear-gradient(160deg, rgba(31, 42, 68, 0.50), rgba(10, 14, 28, 0.80))',
        border: '1px solid rgba(148,163,184,0.10)',
      }}
      className="card-hover"
    >
      {/* Top gradient stripe */}
      <div style={{
        height: '3px', background: colors.bg,
        boxShadow: `0 0 14px ${colors.glow}`,
      }} />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 className="font-display" style={{
              fontSize: '14px', fontWeight: '700', color: '#f1f5f9',
              letterSpacing: '-0.01em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{activity.name}</h4>
            {activity.city && (
              <p style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <MapPin style={{ width: '10px', height: '10px' }} />
                {typeof activity.city === 'object' ? activity.city.name : activity.city}
              </p>
            )}
          </div>
          <span style={{
            padding: '4px 9px', borderRadius: '999px', fontSize: '9px', fontWeight: '700',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            background: colors.tag, color: colors.tagColor,
            border: `1px solid ${colors.glow}`,
            flexShrink: 0,
          }}>
            {activity.type}
          </span>
        </div>

        <p style={{
          fontSize: '12px', color: '#94a3b8', lineHeight: '1.5',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {activity.description}
        </p>

        <div style={{
          display: 'flex', gap: '12px', fontSize: '12px', color: '#cbd5e1',
          paddingTop: '10px', borderTop: '1px solid rgba(148, 163, 184, 0.08)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign style={{ width: '12px', height: '12px', color: '#22D3EE' }} />
            <span style={{ fontWeight: 600 }}>₹{activity.averageCost}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock style={{ width: '12px', height: '12px', color: '#a78bfa' }} />
            {activity.duration}h
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star style={{ width: '12px', height: '12px', color: '#fbbf24' }} />
            {activity.rating}
          </span>
        </div>

        {onAdd && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onAdd(activity)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              width: '100%', padding: '9px', borderRadius: '11px',
              fontSize: '12px', fontWeight: '600',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.10))',
              color: '#22D3EE',
              border: '1px solid rgba(6,182,212,0.25)', cursor: 'pointer',
              marginTop: '4px',
            }}>
            <Plus style={{ width: '13px', height: '13px' }} /> Add to Trip
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityCard;
