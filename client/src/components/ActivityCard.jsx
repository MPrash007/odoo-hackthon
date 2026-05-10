import { motion } from 'framer-motion';
import { Clock, DollarSign, Star, MapPin } from 'lucide-react';

const typeColors = {
  sightseeing: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'rgba(245,158,11,0.3)' },
  food: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'rgba(239,68,68,0.3)' },
  adventure: { bg: 'linear-gradient(135deg, #10b981, #059669)', border: 'rgba(16,185,129,0.3)' },
  culture: { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: 'rgba(139,92,246,0.3)' },
  relaxation: { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'rgba(59,130,246,0.3)' },
};

const ActivityCard = ({ activity, onAdd }) => {
  const colors = typeColors[activity.type] || typeColors.sightseeing;

  return (
    <motion.div whileHover={{ y: -4 }}
      style={{
        borderRadius: '14px', overflow: 'hidden',
        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
        border: '1px solid rgba(148,163,184,0.1)',
        transition: 'all 0.3s',
      }}
      className="card-hover"
    >
      <div style={{ height: '4px', background: colors.bg }} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>{activity.name}</h4>
            {activity.city && (
              <p style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                <MapPin style={{ width: '10px', height: '10px' }} />
                {typeof activity.city === 'object' ? activity.city.name : activity.city}
              </p>
            )}
          </div>
          <span style={{
            padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: '600',
            textTransform: 'uppercase', background: colors.bg, color: 'white',
          }}>
            {activity.type}
          </span>
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {activity.description}
        </p>

        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign style={{ width: '12px', height: '12px' }} />${activity.averageCost}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock style={{ width: '12px', height: '12px' }} />{activity.duration}h</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star style={{ width: '12px', height: '12px', color: '#f59e0b' }} />{activity.rating}</span>
        </div>

        {onAdd && (
          <button onClick={() => onAdd(activity)}
            style={{
              width: '100%', padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
              background: 'rgba(6,182,212,0.12)', color: '#22D3EE',
              border: '1px solid rgba(6,182,212,0.2)', cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px',
            }}>
            + Add to Trip
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityCard;
