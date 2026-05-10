import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false, text = 'Loading your adventure...' }) => {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        {/* Outer rotating ring */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#22D3EE',
            borderRightColor: 'rgba(139, 92, 246, 0.55)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner counter-rotating ring */}
        <motion.div
          style={{
            position: 'absolute', inset: '10px', borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#EC4899',
            borderLeftColor: 'rgba(6, 182, 212, 0.4)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center pulsing globe */}
        <motion.div
          style={{
            position: 'absolute', inset: '20px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(139, 92, 246, 0.55)',
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Globe style={{ width: '14px', height: '14px', color: 'white' }} />
        </motion.div>
      </div>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.02em' }}
      >
        {text}
      </motion.p>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5, 8, 22, 0.85)', backdropFilter: 'blur(8px)', zIndex: 100,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0' }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
