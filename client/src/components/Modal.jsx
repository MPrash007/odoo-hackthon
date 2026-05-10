import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '480px' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(2, 4, 14, 0.7)',
              backdropFilter: 'blur(10px)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            style={{
              position: 'relative', width: '100%', maxWidth,
              maxHeight: '88vh', overflowY: 'auto', borderRadius: '22px',
              background: 'linear-gradient(160deg, rgba(20, 26, 48, 0.95), rgba(8, 12, 28, 0.98))',
              border: '1px solid rgba(148, 163, 184, 0.14)',
              backdropFilter: 'blur(28px) saturate(160%)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(6, 182, 212, 0.06), 0 0 60px rgba(139, 92, 246, 0.10)',
            }}
          >
            {/* Top gradient border accent */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.6), rgba(139, 92, 246, 0.6), transparent)',
            }} />

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid rgba(148,163,184,0.08)',
            }}>
              <h3 className="font-display" style={{
                fontSize: '18px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.01em',
              }}>{title}</h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  padding: '8px', borderRadius: '10px',
                  background: 'rgba(148, 163, 184, 0.06)', border: '1px solid rgba(148, 163, 184, 0.10)',
                  cursor: 'pointer', color: '#94a3b8',
                }}>
                <X style={{ width: '16px', height: '16px' }} />
              </motion.button>
            </div>
            <div style={{ padding: '22px 24px' }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
