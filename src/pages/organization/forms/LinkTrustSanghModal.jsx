import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function LinkTrustSanghModal({ isOpen, onClose, trusts, sanghs, onLink }) {
  const [trustId, setTrustId] = useState('');
  const [sanghId, setSanghId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!trustId || !sanghId) return;
    onLink(trustId, sanghId);
    setTrustId('');
    setSanghId('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Link Trust & Sangh</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Select Trust</label>
            <div className="relative">
              <select value={trustId} onChange={e => setTrustId(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none appearance-none focus:border-emerald-500 transition-all">
                <option value="">Choose a Trust</option>
                {trusts.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Select Sangh</label>
            <div className="relative">
              <select value={sanghId} onChange={e => setSanghId(e.target.value)} className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none appearance-none focus:border-emerald-500 transition-all">
                <option value="">Choose a Sangh</option>
                {sanghs.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100">Link Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}