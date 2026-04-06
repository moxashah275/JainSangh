import { Users, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

export default function SanghCard({ sangh, trustName, memberCount, onEdit, onDelete, index }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden cursor-pointer relative"
      style={{ animation: 'cardIn 0.3s ease-out ' + (index * 0.04) + 's both' }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-emerald-600" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-teal-700 truncate">{sangh.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium truncate">{trustName}</p>
            </div>
          </div>
          <StatusBadge status={sangh.status} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{sangh.type}</span>
          <span className="text-[11px] text-teal-600 font-bold">{memberCount} Members</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-0.5 px-5 py-3 border-t border-slate-50 bg-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity" onClick={function(e) { e.stopPropagation() }}>
        <button onClick={onEdit} className="w-7 h-7 rounded-md bg-slate-50 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={onDelete} className="w-7 h-7 rounded-md bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}