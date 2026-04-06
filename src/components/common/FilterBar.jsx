import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export default function FilterBar({ filters, options, onChange, onClear }) {
  const hasActive = Object.values(filters || {}).some(v => v && v !== 'All' && v !== '');

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400 shrink-0">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-[12px] font-bold uppercase tracking-wider">Filters</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {(options || []).map(opt => (
          <select 
            key={opt.key} 
            value={filters?.[opt.key] || ''} 
            onChange={e => onChange(opt.key, e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-600 font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all cursor-pointer"
          >
            <option value="">{opt.placeholder}</option>
            {(opt.items || []).map(item => (
              <option key={typeof item === 'string' ? item : item.value} value={typeof item === 'string' ? item : item.value}>
                {typeof item === 'string' ? item : item.label}
              </option>
            ))}
          </select>
        ))}
        {hasActive && (
          <button 
            onClick={onClear} 
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-500 text-[12px] font-bold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <X className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>
    </div>
  );
}