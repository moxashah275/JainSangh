import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export default function FilterBar({ filters, options, onChange, onClear }) {
  const hasActive = Object.values(filters || {}).some(v => v && v !== 'All' && v !== '');

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-100/70">
      <div className="flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-500 shrink-0 border border-slate-200">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Filters</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {(options || []).map(opt => (
            <select 
              key={opt.key} 
              value={filters?.[opt.key] || ''} 
              onChange={e => onChange(opt.key, e.target.value)}
              className="min-w-[140px] px-3.5 py-3 bg-slate-50/70 border border-slate-200 rounded-2xl text-[12px] text-slate-600 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-50 transition-all cursor-pointer"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-3 bg-slate-900 text-white text-[12px] font-semibold rounded-2xl hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
