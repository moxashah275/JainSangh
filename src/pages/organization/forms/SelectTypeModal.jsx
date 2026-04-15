import React from 'react';
import { Building2, Users, X } from 'lucide-react';

export default function SelectTypeModal({ onClose, onSelectTrust, onSelectSangh }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Select Type</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <button onClick={onSelectTrust} className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Building2 size={24} /></div>
            <span className="font-bold text-slate-700 group-hover:text-emerald-700">Create Trust</span>
          </button>
          <button onClick={onSelectSangh} className="p-6 rounded-2xl border-2 border-slate-100 hover:border-teal-500 hover:bg-teal-50 transition-all group flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Users size={24} /></div>
            <span className="font-bold text-slate-700 group-hover:text-teal-700">Create Sangh</span>
          </button>
        </div>
      </div>
    </div>
  );
}