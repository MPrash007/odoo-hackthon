import { motion } from 'framer-motion';
import { Calendar, MapPin, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDateRange } from '../utils/formatDate';

const statusStyles = {
  ongoing: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
  upcoming: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
  completed: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' },
};

const TripCard = ({ trip, onView, onEdit, onDelete }) => {
  const status = statusStyles[trip.status] || statusStyles.upcoming;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      style={{
        borderRadius: '16px', overflow: 'hidden',
        background: 'linear-gradient(145deg, #1e293b, #0f172a)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      className="card-hover group"
    >
      {/* Cover */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600'}
          alt={trip.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          className="group-hover:scale-110"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(7, 11, 20, 0.9) 0%, rgba(7, 11, 20, 0.2) 50%, transparent 100%)',
        }} />
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '4px 12px', borderRadius: '999px',
          fontSize: '11px', fontWeight: '600',
          background: status.bg, color: status.color,
          border: `1px solid ${status.border}`,
          textTransform: 'capitalize',
        }}>
          {trip.status}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 style={{
          fontSize: '17px', fontWeight: '700', color: '#f1f5f9',
          marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {trip.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Calendar style={{ width: '13px', height: '13px' }} />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin style={{ width: '13px', height: '13px' }} />
            {trip.destinations?.length || 0} {trip.destinations?.length === 1 ? 'city' : 'cities'}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onView?.(trip._id); }}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
              background: 'rgba(6, 182, 212, 0.12)', color: '#22D3EE',
              border: '1px solid rgba(6, 182, 212, 0.2)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Eye style={{ width: '14px', height: '14px' }} /> View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(trip._id); }}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500',
              background: 'rgba(148, 163, 184, 0.08)', color: '#cbd5e1',
              border: '1px solid rgba(148, 163, 184, 0.1)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Edit style={{ width: '14px', height: '14px' }} /> Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(trip._id); }}
            style={{
              padding: '8px', borderRadius: '10px',
              background: 'transparent', color: '#64748b',
              border: '1px solid rgba(148, 163, 184, 0.08)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
