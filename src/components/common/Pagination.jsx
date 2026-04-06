import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalItems, perPage, onChange }) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className="flex items-center justify-between pt-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm mt-4">
      <span className="text-[12px] font-bold text-slate-400">Showing {from}–{to} of {totalItems}</span>
      <div className="flex items-center gap-1.5">
        <button 
          onClick={() => onChange(page - 1)} 
          disabled={page === 1}
          className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-50 border border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button 
            key={p} 
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${page === p ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
          >
            {p}
          </button>
        ))}
        <button 
          onClick={() => onChange(page + 1)} 
          disabled={page === totalPages}
          className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-50 border border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}