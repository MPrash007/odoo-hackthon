import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullPage = false, text = 'Loading...' }) => {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <motion.div
        style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid rgba(6, 182, 212, 0.15)',
          borderTopColor: '#06B6D4',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p style={{ fontSize: '13px', color: '#64748b' }}>{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(7, 11, 20, 0.85)', zIndex: 100 }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
