import { Shield, Users, Landmark, ArrowRight } from 'lucide-react'
import StatusBadge from '../common/StatusBadge'

var TYPE_ICON = { System: Shield, Sangh: Users, Trust: Landmark }
var TYPE_S = {
  System: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
  Sangh: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  Trust: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' }
}

export default function RoleCard({ role, userCount, permCount, onClick, index }) {
  var Icon = TYPE_ICON[role.type] || Shield
  var s = TYPE_S[role.type] || TYPE_S.Sangh

  return (
    <div onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer relative"
      style={{ animation: 'cardIn 0.3s ease-out ' + (index * 0.04) + 's both' }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={s.text + ' w-5 h-5 shrink-0'} strokeWidth={2} />
            <div className="min-w-0">
              <h3 className="text-[13px] font-bold text-slate-800 group-hover:text-teal-700 truncate">{role.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={'text-[10px] font-bold uppercase tracking-wider ' + s.text}>{role.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] text-slate-400">{role.permissions === 'all' ? 'Full Access' : 'Custom'}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={role.status} />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{role.description}</p>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-bold text-slate-700">{userCount} Users</span>
          <span className="text-[12px] font-bold text-slate-700">{permCount} Perms</span>
        </div>
        <ArrowRight className="w-4 h-4 text-teal-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
      </div>
    </div>
  )
}