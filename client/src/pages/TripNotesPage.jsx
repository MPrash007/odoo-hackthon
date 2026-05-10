import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { notesService } from '../services/budgetService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { timeAgo } from '../utils/formatDate';
import toast from 'react-hot-toast';

const TripNotesPage = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', day: '', stop: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => { notesService.getNotes(id).then(setNotes).finally(() => setLoading(false)); }, [id]);

  const openAdd = () => { setEditing(null); setForm({ title: '', content: '', day: '', stop: '' }); setModalOpen(true); };
  const openEdit = (note) => { setEditing(note); setForm({ title: note.title, content: note.content, day: note.day, stop: note.stop }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title) return toast.error('Title required');
    try {
      if (editing) { const updated = await notesService.updateNote(editing._id, form); setNotes(p => p.map(n => n._id === editing._id ? updated : n)); toast.success('Updated'); }
      else { const note = await notesService.addNote(id, form); setNotes(p => [note, ...p]); toast.success('Added'); }
      setModalOpen(false);
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;
    try { await notesService.deleteNote(noteId); setNotes(p => p.filter(n => n._id !== noteId)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => (filter === 'day' ? n.day : n.stop));

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold text-white flex items-center gap-2"><FileText className="w-7 h-7 text-teal-400" />Trip Notes</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold"><Plus className="w-4 h-4" />Add Note</motion.button>
      </div>
      <div className="flex gap-2">{['all', 'day', 'stop'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? 'bg-teal-500/20 text-teal-400' : 'bg-white/5 text-slate-400'}`}>{f === 'all' ? 'All' : `By ${f}`}</button>)}</div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map(note => (
            <motion.div key={note._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass rounded-xl p-4 space-y-2 border border-white/5 hover:border-teal-500/20 transition-all">
              <div className="flex items-start justify-between">
                <div><h3 className="font-bold text-white">{note.title}</h3><p className="text-xs text-slate-500">{timeAgo(note.createdAt)}</p></div>
                <div className="flex gap-1"><button onClick={() => openEdit(note)} className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-teal-400/10"><Edit className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(note._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-3.5 h-3.5" /></button></div>
              </div>
              <p className="text-sm text-slate-300 line-clamp-3">{note.content}</p>
              <div className="flex gap-2">{note.day && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs flex items-center gap-1"><Calendar className="w-3 h-3" />{note.day}</span>}{note.stop && <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{note.stop}</span>}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && <div className="text-center py-16 glass rounded-2xl"><FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" /><p className="text-slate-400">No notes yet. Start journaling!</p></div>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Note' : 'Add Note'}>
        <div className="space-y-4">
          <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50" placeholder="Note title..." />
          <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 resize-none" placeholder="Write your note..." />
          <div className="grid grid-cols-2 gap-3"><input value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500" placeholder="e.g. Day 1" /><input value={form.stop} onChange={e => setForm(p => ({ ...p, stop: e.target.value }))} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500" placeholder="e.g. Paris" /></div>
          <button onClick={handleSave} className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-sm">{editing ? 'Update Note' : 'Add Note'}</button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TripNotesPage;
