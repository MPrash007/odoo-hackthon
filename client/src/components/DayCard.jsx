import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const ICON_MAP = {
  sightseeing: '🏛️',
  food: '🍽️',
  transport: '🚗',
  accommodation: '🏨',
  adventure: '🧗',
  culture: '🎭',
  relaxation: '🧘',
};

const DayCard = ({ day, isDefaultOpen }) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  return (
    <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isOpen ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#06B6D4', color: 'white', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
            {day.day}
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px', fontWeight: '600' }}>{day.title}</h3>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '13px', color: '#94a3b8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {day.location}</span>
              <span>•</span>
              <span>Budget: {day.dailyBudget}</span>
            </div>
          </div>
        </div>
        <div>
          {isOpen ? <ChevronUp color="#94a3b8" /> : <ChevronDown color="#94a3b8" />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              
              {/* Activities Timeline */}
              <div style={{ position: 'relative', paddingLeft: '16px', marginLeft: '8px', borderLeft: '2px solid rgba(6, 182, 212, 0.3)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {day.activities.map((act, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Timeline Dot */}
                    <div style={{ position: 'absolute', left: '-23px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#06B6D4', border: '2px solid #0F172A' }} />
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ fontSize: '24px' }}>{ICON_MAP[act.type] || '📍'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '16px', fontWeight: '600' }}>{act.name}</h4>
                          <span style={{ color: '#22D3EE', fontSize: '14px', fontWeight: '600' }}>{act.estimatedCost > 0 ? act.estimatedCost : 'Free'}</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>{act.time} • {act.duration} hrs</div>
                        <p style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '6px', lineHeight: '1.5' }}>{act.description}</p>
                        {act.tips && (
                          <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '2px solid #f59e0b', borderRadius: '4px', color: '#fcd34d', fontSize: '13px' }}>
                            💡 <strong>Tip:</strong> {act.tips}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Accommodation block */}
              {day.accommodation && (
                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🏨</span>
                    <h4 style={{ margin: 0, color: 'white', fontSize: '15px' }}>Accommodation: {day.accommodation.name}</h4>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '32px' }}>
                    {day.accommodation.type} • {day.accommodation.estimatedCost} <br/>
                    {day.accommodation.notes}
                  </div>
                </div>
              )}

              {/* Transport Note */}
              {day.transport && (
                <div style={{ marginTop: '12px', padding: '12px 16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
                  <span style={{ fontSize: '18px' }}>🚗</span> <strong>Transport:</strong> {day.transport}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DayCard;
