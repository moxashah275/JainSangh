import { MapPin, Pencil, Trash2 } from 'lucide-react'

export default function LocationCard({ location, sanghCount, onEdit, onDelete, index }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden cursor-pointer relative"
      style={{ animation: 'cardIn 0.3s ease-out ' + (index * 0.04) + 's both' }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-amber-600" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-teal-700 truncate">{location.city}</h3>
            <p className="text-[11px] text-slate-400 font-medium truncate">{location.district}, {location.state}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span>Pincode: {location.pincode}</span>
          <span className="text-amber-600 font-bold">{sanghCount} Sanghs</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-0.5 px-5 py-3 border-t border-slate-50 bg-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity" onClick={function(e) { e.stopPropagation() }}>
        <button onClick={onEdit} className="w-7 h-7 rounded-md bg-slate-50 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
        <button onClick={onDelete} className="w-7 h-7 rounded-md bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}