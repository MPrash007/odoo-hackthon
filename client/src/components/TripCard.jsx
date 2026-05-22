import { motion } from 'framer-motion';
import { Calendar, MapPin, Trash2, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { formatDateRange } from '../utils/formatDate';
import { getTripCover } from '../utils/coverImage';

const statusConfig = {
  ongoing: { color: '#059669', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.20)', label: 'Ongoing', dot: '#10B981' },
  upcoming: { color: '#2563EB', bg: 'rgba(37, 99, 235, 0.06)', border: 'rgba(37, 99, 235, 0.18)', label: 'Upcoming', dot: '#2563EB' },
  completed: { color: '#64748B', bg: 'rgba(100, 116, 139, 0.08)', border: 'rgba(100, 116, 139, 0.18)', label: 'Completed', dot: '#94A3B8' },
};

const TripCard = ({ trip, onView, onEdit, onDelete }) => {
  const status = statusConfig[trip.status] || statusConfig.upcoming;
  const coverPhoto = getTripCover(trip);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(17, 24, 39, 0.04)',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      className="card-hover"
    >
      {/* Cover image */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={coverPhoto}
          alt={trip.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent 60%)',
        }} />
        {/* Status badge */}
        <span style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '5px 12px', borderRadius: '999px',
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(8px)',
          fontSize: '11px', fontWeight: '600',
          color: status.color,
          border: `1px solid ${status.border}`,
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: status.dot,
          }} />
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '18px' }}>
        <h3 className="font-display" style={{
          fontSize: '17px', fontWeight: '600', color: '#111827',
          letterSpacing: '-0.01em', marginBottom: '8px',
        }}>
          {trip.title}
        </h3>

        {trip.destinations?.length > 0 && (
          <p style={{
            fontSize: '13px', color: '#64748B',
            display: 'flex', alignItems: 'center', gap: '5px',
            marginBottom: '6px',
          }}>
            <MapPin style={{ width: '13px', height: '13px', color: '#7C3AED' }} />
            {trip.destinations.join(' · ')}
          </p>
        )}

        <p style={{
          fontSize: '12px', color: '#94A3B8',
          display: 'flex', alignItems: 'center', gap: '5px',
          marginBottom: '14px',
        }}>
          <Calendar style={{ width: '12px', height: '12px', color: '#2563EB' }} />
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>

        {/* Actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          paddingTop: '14px',
          borderTop: '1px solid #F1F5F9',
        }}>
          {onView && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onView(trip._id); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '9px', borderRadius: '10px',
                background: '#2563EB', color: 'white',
                fontSize: '12px', fontWeight: '600',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.20)',
              }}
            >
              <Eye style={{ width: '13px', height: '13px' }} /> View
            </motion.button>
          )}
          {onEdit && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onEdit(trip._id); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '9px', borderRadius: '10px',
                background: '#F1F5F9', color: '#374151',
                fontSize: '12px', fontWeight: '600',
                border: '1px solid #E2E8F0', cursor: 'pointer',
              }}
            >
              <Edit style={{ width: '13px', height: '13px' }} /> Edit
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onDelete(trip._id); }}
              style={{
                padding: '9px', borderRadius: '10px',
                background: 'transparent', color: '#94A3B8',
                border: '1px solid transparent', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = 'rgba(220, 38, 38, 0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 style={{ width: '13px', height: '13px' }} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;
