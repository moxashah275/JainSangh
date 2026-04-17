import { Globe2, MapPinned, Navigation, Building2, Hash } from 'lucide-react'
import StatCard from '../../components/ui/StatCard'

export default function LocationStats({ statsData }) {
  
  const items = [
    { label: 'Countries', value: statsData?.Country || '30', icon: Globe2, color: 'teal' },
    { label: 'States', value: statsData?.State || '30', icon: MapPinned, color: 'emerald' },
    { label: 'Cities', value: statsData?.City || '30', icon: Navigation, color: 'teal' },
    { label: 'Areas', value: statsData?.Area || '30', icon: Building2, color: 'emerald' },
    { label: 'Pincodes', value: statsData?.Pincode || '30', icon: Hash, color: 'teal' },
  ]

  return (
    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {items.map((s) => (
        <div key={s.label} className="flex-1 min-w-[160px]">
          <StatCard 
            title={s.label} 
            value={s.value.toString()} 
            icon={s.icon} 
            color={s.color} 
            compact
            className="hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1"
          />
        </div>
      ))}
    </div>
  )
}