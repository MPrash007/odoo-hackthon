import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const PaymentModal = ({ isOpen, onClose, trip }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !trip) return null;

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return navigate('/login');
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };

      // 1. Check if user already has access
      const accessRes = await axios.get(`${API_URL}/chat/access/${trip._id}?creatorId=${trip.user._id || trip.user}`, { headers });
      if (accessRes.data.hasAccess) {
        toast.success('You already have access!');
        navigate('/chat');
        return;
      }

      // 2. Create Razorpay order
      const { data: order } = await axios.post(`${API_URL}/payment/create-order`, {
        tripId: trip._id,
        creatorId: trip.user._id || trip.user
      }, { headers });

      // 3. Load Razorpay
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Traveloop Premium",
        description: "Direct Chat Access with Traveler",
        order_id: order.orderId,
        handler: async function (response) {
          try {
            // 4. Verify payment on backend
            const verifyRes = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tripId: trip._id,
              creatorId: trip.user._id || trip.user
            }, { headers });

            if (verifyRes.data.success) {
              toast.success('Payment successful! Chat unlocked.');
              navigate('/chat');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: {
          color: "#22D3EE"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        toast.error('Payment failed or cancelled.');
      });
      rzp1.open();
      onClose(); // Close modal on open
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing payment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(5, 8, 22, 0.8)', backdropFilter: 'blur(8px)' }} />

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            position: 'relative', width: '100%', maxWidth: '440px',
            background: 'linear-gradient(180deg, #11163a 0%, #0b1027 100%)',
            borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(148,163,184,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
          
          {/* Header Banner */}
          <div style={{ position: 'relative', height: '120px', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', overflow: 'hidden' }}>
            <div className="noise" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
            <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
              <X style={{ width: '16px', height: '16px' }} />
            </button>
            <div style={{ position: 'absolute', bottom: '-30px', left: '32px', width: '64px', height: '64px', borderRadius: '18px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #11163a', zIndex: 2 }}>
              <MessageCircle style={{ color: '#22D3EE', width: '28px', height: '28px' }} />
            </div>
            {/* Sparkles */}
            <Sparkles style={{ position: 'absolute', top: '20px', right: '40px', color: 'white', opacity: 0.4 }} />
            <Sparkles style={{ position: 'absolute', bottom: '20px', right: '80px', color: 'white', opacity: 0.2, width: '16px' }} />
          </div>

          <div style={{ padding: '40px 32px 32px' }}>
            <span className="eyebrow" style={{ color: '#F472B6', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck style={{ width: '12px', height: '12px' }} /> Premium Access
            </span>
            <h2 className="font-display" style={{ fontSize: '24px', fontWeight: '800', color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
              Chat with Traveler
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Unlock 24-hour direct access to this traveler and get personalized travel advice, hidden gems, real experiences, and budget tips.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Clock style={{ color: '#FBBF24', width: '16px', height: '16px' }} />
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>24-hour chat access window</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <CheckCircle2 style={{ color: '#22D3EE', width: '16px', height: '16px' }} />
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Ask personalized questions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 style={{ color: '#22D3EE', width: '16px', height: '16px' }} />
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>Get exclusive local recommendations</span>
              </div>
            </div>

            <button onClick={handlePayment} disabled={loading} style={{
              width: '100%', padding: '16px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
              color: 'white', fontWeight: '700', fontSize: '16px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.4)'
            }}>
              {loading ? (
                <span className="shimmer-effect" style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white' }} />
              ) : (
                <>Unlock Chat for ₹20 <Sparkles style={{ width: '16px', height: '16px' }} /></>
              )}
            </button>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <ShieldCheck style={{ width: '12px', height: '12px' }} /> Secured by Razorpay
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
