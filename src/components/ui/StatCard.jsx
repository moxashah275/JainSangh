import { TrendingUp, TrendingDown } from 'lucide-react'

const colorMap = {
  teal:   { bg: 'bg-teal-50',    border: 'border-teal-200/60',  icon: 'bg-teal-600',   iconText: 'text-teal-600' },
  emerald:{ bg: 'bg-emerald-50', border: 'border-emerald-200/60', icon: 'bg-emerald-600', iconText: 'text-emerald-600' },
  rose:   { bg: 'bg-rose-50',    border: 'border-rose-200/60',  icon: 'bg-rose-600',   iconText: 'text-rose-600' },
  sky:    { bg: 'bg-sky-50',     border: 'border-sky-200/60',   icon: 'bg-sky-600',    iconText: 'text-sky-600' },
  amber:  { bg: 'bg-amber-50',   border: 'border-amber-200/60', icon: 'bg-amber-600',  iconText: 'text-amber-600' },
}

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'teal', className = '' }) {
  const c = colorMap[color] || colorMap.teal
  const isPositive = trend === 'up'
  return (
    <div className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-[26px] font-bold text-slate-900 tracking-tight leading-none">{value}</p>
          {trendValue !== undefined && (
            <div className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-100/80 text-emerald-700' : 'bg-rose-100/80 text-rose-700'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${c.icon} w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/10`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}