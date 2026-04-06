import { useNavigate } from 'react-router-dom'
import { 
  Users, Landmark, Building2, ArrowUpRight, 
  MapPin, HeartHandshake, GraduationCap, Globe2 
} from 'lucide-react'

const MODULE_OVERVIEW = [
  { 
    title: 'Location Setup', 
    desc: 'Manage Country, State, City, and Area hierarchy', 
    icon: Globe2, 
    count: '4 Cities', 
    color: 'teal', 
    to: '/masters/location' 
  },
  { 
    title: 'Sangh Management', 
    desc: 'Area-wise Sangh mapping and management', 
    icon: MapPin, 
    count: '2 Sanghs', 
    color: 'emerald', 
    to: '/masters/sangh' 
  },
  { 
    title: 'Trust Management', 
    desc: 'Registration, committee, and bank details', 
    icon: Landmark, 
    count: '5 Trusts', 
    color: 'green', 
    to: '/masters/trust' 
  },
  { 
    title: 'Donation System', 
    desc: '80G receipts, Jivdaya, Devdravya, and Pathshala funds', 
    icon: HeartHandshake, 
    count: '₹15.4L', 
    color: 'teal', 
    to: '/donations' 
  },
  { 
    title: 'Family Records', 
    desc: 'Home listing, head details, and classification', 
    icon: Users, 
    count: '850 Families', 
    color: 'emerald', 
    to: '/members' 
  },
  { 
    title: 'Derasar & Operations', 
    desc: 'Pratima details, Salgirah, and daily seva records', 
    icon: Building2, 
    count: '3 Derasars', 
    color: 'green', 
    to: '/derasar' 
  },
  { 
    title: 'Pathshala System', 
    desc: 'Student batches, teachers, and monthly exams', 
    icon: GraduationCap, 
    count: '120 Students', 
    color: 'teal', 
    to: '/pathshala' 
  }
]

// Pure green and teal theme mapping according to your website
const STYLES = {
  teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600',    badge: 'bg-teal-50 text-teal-600',    bd: 'hover:border-teal-200' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600', bd: 'hover:border-emerald-200' },
  green:   { bg: 'bg-green-50',   icon: 'text-green-600',   badge: 'bg-green-50 text-green-600',   bd: 'hover:border-green-200' }
}

export default function OverviewList() {
  const navigate = useNavigate()

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-6 pb-8 bg-[#fafafa] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-6">
        
        {/* ── Only Overview Heading (No breadcrumbs, No extra small texts) ── */}
        <div>
          <h1 className="text-[22px] font-bold text-teal-700 tracking-tight">Overview</h1>
          <p className="text-[13px] font-medium text-slate-400 mt-0.5">Real-time monitoring of all active modules</p>
        </div>

        {/* ── 7 Premium Cards with Pure Green & Teal Theme ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULE_OVERVIEW.map((card, index) => {
            const s = STYLES[card.color]
            return (
              <div 
                key={card.title} 
                onClick={() => navigate(card.to)} 
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
                className={`group bg-white rounded-2xl border border-slate-100 p-6 cursor-pointer ${s.bd} hover:shadow-lg hover:shadow-slate-500/5 hover:-translate-y-0.5 transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center transition-colors`}>
                    <card.icon className={`w-5 h-5 ${s.icon}`} strokeWidth={2} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
                
                <h3 className="text-[15px] font-bold text-slate-800 mb-1">{card.title}</h3>
                <p className="text-[12px] font-medium text-slate-400 mb-4 leading-relaxed">{card.desc}</p>
                
                <span className={`text-[11px] font-bold ${s.badge} px-2.5 py-1 rounded-full`}>
                  {card.count}
                </span>
              </div>
            )
          })}
        </div>

      </div>

      {/* ── Local CSS for Fade-in top animation ── */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}