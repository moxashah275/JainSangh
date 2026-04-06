import React from 'react';
import { Pencil, Trash2, Eye, ShieldCheck, FileText } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const TYPE_CLR = {
  System: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  Sangh: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  Trust: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }
};

export default function UserCard({ user, role, docCount, onView, onEdit, onDelete, index }) {
  const s = TYPE_CLR[role?.type] || TYPE_CLR.System;
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <div 
      onClick={onView}
      className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer relative"
      style={{ animation: `cardIn 0.3s ease-out ${index * 0.04}s both` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 transition-all duration-300 opacity-0 group-hover:opacity-100" />
      
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center ${s.text} font-bold text-[12px] shrink-0`}>
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-slate-800 transition-colors group-hover:text-teal-700 truncate">{user.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">{user.phone}</p>
            </div>
          </div>
          <StatusBadge status={user.status} />
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{role?.name || 'No Role'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>{docCount || 0} Docs</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50 bg-slate-50/30">
        <span className="text-[11px] font-bold text-slate-400">ID: {user.id}</span>
        <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
          <button onClick={onView} className="w-7 h-7 rounded-md hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center text-slate-400 transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit} className="w-7 h-7 rounded-md hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-md hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}