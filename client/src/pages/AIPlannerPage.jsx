import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';
import AIForm from '../components/AIForm';
import ItineraryResult from '../components/ItineraryResult';

const AIPlannerPage = () => {
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [streamText, setStreamText] = useState('');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', paddingBottom: '80px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '40px' }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '20px', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', marginBottom: '20px' }}
        >
          <Plane style={{ color: 'white', width: '32px', height: '32px' }} />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-display" style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '10px' }}
        >
          AI Trip Planner
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#22D3EE', fontSize: '18px', fontWeight: '500' }}
        >
          Your personalized journey, crafted in seconds.
        </motion.p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <AnimatePresence mode="wait">
          {!itinerary ? (
            <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}>
              <AIForm 
                loading={loading} setLoading={setLoading} 
                setItinerary={setItinerary} 
                streamText={streamText} setStreamText={setStreamText} 
              />
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
              <ItineraryResult itinerary={itinerary} onReset={() => setItinerary(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIPlannerPage;
