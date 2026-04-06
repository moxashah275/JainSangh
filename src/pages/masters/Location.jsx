import { useState } from 'react'
import { MapPin, ChevronDown, ChevronRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'

const LOCATIONS = [
  { id: 1, state: 'Gujarat', city: 'Ahmedabad', areas: ['Navrangpura', 'Vastrapur', 'Satellite', 'Bodakdev', 'SG Highway'] },
  { id: 2, state: 'Gujarat', city: 'Surat', areas: ['Adajan', 'Ring Road', 'Vesu'] },
  { id: 3, state: 'Gujarat', city: 'Rajkot', areas: ['Kalawad Road', 'University Road'] }
]

export default function Location() {
  const [expanded, setExpanded] = useState({})
  return (
    <div className="space-y-6">
      <PageHeader title="Location Setup" subtitle="State → City → Area hierarchy" breadcrumbs={[{ label: 'Home' }, { label: 'Masters' }, { label: 'Location' }]} action={<Button size="sm" icon={MapPin}>Add Location</Button>} />
      <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100">
        {LOCATIONS.map((loc) => (
          <div key={loc.id}>
            <button onClick={() => setExpanded((p) => ({ ...p, [loc.id]: !p[loc.id] }))} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50/80 transition-colors">
              {expanded[loc.id] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-teal-600" /></div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-slate-700">{loc.city}, {loc.state}</p>
                <p className="text-[11px] text-slate-400">{loc.areas.length} areas</p>
              </div>
            </button>
            {expanded[loc.id] && (
              <div className="px-5 pb-4 pl-16">
                <div className="flex flex-wrap gap-2">
                  {loc.areas.map((area, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-600 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all cursor-pointer">{area}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}