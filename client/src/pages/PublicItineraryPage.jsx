import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Calendar, MapPin, Copy } from 'lucide-react';
import { tripService } from '../services/tripService';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateRange } from '../utils/formatDate';
import toast from 'react-hot-toast';

const PublicItineraryPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { tripService.getPublicTrip(id).then(setData).catch(() => {}).finally(() => setLoading(false)); }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-navy-900"><p className="text-slate-400 text-lg">Trip not found or not public.</p></div>;

  const { trip, itinerary } = data;

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center mx-auto"><Globe className="w-7 h-7 text-white" /></div>
          <h1 className="text-4xl font-bold text-white">{trip.title}</h1>
          <p className="text-slate-400 flex items-center justify-center gap-2"><Calendar className="w-4 h-4" />{formatDateRange(trip.startDate, trip.endDate)}</p>
          {trip.destinations?.length > 0 && <div className="flex items-center justify-center gap-2 flex-wrap">{trip.destinations.map(d => <span key={d} className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" />{d}</span>)}</div>}
          {trip.description && <p className="text-slate-300 max-w-xl mx-auto">{trip.description}</p>}
          {trip.user && <p className="text-sm text-slate-500">By {trip.user.firstName} {trip.user.lastName}</p>}
        </motion.div>

        {/* Itinerary */}
        {itinerary?.sections?.map((section, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass rounded-2xl p-6 space-y-3">
            <h3 className="text-xl font-bold text-white">{section.title}</h3>
            {section.description && <p className="text-sm text-slate-400">{section.description}</p>}
            <div className="space-y-2">{section.activities?.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2"><span className="text-sm text-white">{a.name}</span><span className="text-xs text-slate-500 capitalize bg-white/5 px-1.5 py-0.5 rounded">{a.type}</span></div>
                <span className="text-sm text-teal-400">${a.cost || 0}</span>
              </div>
            ))}</div>
          </motion.div>
        ))}

        <div className="text-center"><button onClick={() => { toast.success('Trip copied to your plans!'); }} className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center gap-2 mx-auto"><Copy className="w-4 h-4" />Copy This Trip</button></div>
      </div>
    </div>
  );
};

export default PublicItineraryPage;
