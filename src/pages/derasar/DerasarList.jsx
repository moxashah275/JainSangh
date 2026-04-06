import { Gem, MapPin, Users, CalendarDays } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'

const DERASARS = [
  { id: 1, name: 'Shree Chandraprabhu Derasar', location: 'Navrangpura, Ahmedabad', pratimas: 12, poojaris: 3, status: 'Active', established: '1960' },
  { id: 2, name: 'Shree Mahaveer Derasar', location: 'Adajan, Surat', pratimas: 8, poojaris: 2, status: 'Active', established: '1975' }
]

export default function DerasarList() {
  return (
    <div className="space-y-5">
      <PageHeader title="Derasar Management" subtitle="Manage Derasar profiles & operations" breadcrumbs={[{ label: 'Home' }, { label: 'Derasar' }]} action={<Button size="sm" icon={Gem}>Add Derasar</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DERASARS.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center"><Gem className="w-5 h-5 text-rose-500" /></div>
              <StatusBadge status={d.status} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-rose-600 transition-colors mb-3">{d.name}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" />{d.location}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Gem className="w-3.5 h-3.5" />{d.pratimas} Pratimas</div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><Users className="w-3.5 h-3.5" />{d.poojaris} Poojaris</div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><CalendarDays className="w-3.5 h-3.5" />Est. {d.established}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}