import React from 'react';

export default function UserStatusToggle({ status, onChange }) {
  const statuses = ['Active', 'Inactive', 'Suspended'];
  
  return (
    <div className="flex items-center gap-2">
      {statuses.map((st) => {
        const isActive = status === st;
        const cls = isActive
          ? st === 'Active' ? 'bg-teal-600 text-white border-transparent shadow-sm'
          : st === 'Inactive' ? 'bg-slate-700 text-white border-transparent shadow-sm'
          : 'bg-amber-500 text-white border-transparent shadow-sm'
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 cursor-pointer';
          
        return (
          <button 
            key={st} 
            onClick={() => onChange(st)}
            className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border ${cls}`}
          >
            {st}
          </button>
        );
      })}
    </div>
  );
}