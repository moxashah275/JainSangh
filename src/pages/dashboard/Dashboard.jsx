import { useNavigate } from 'react-router-dom'
import {
  HandHeart, Users, Landmark, MapPin, 
  Building2, UserPlus, FileText, Settings, 
  TrendingUp, ArrowDownRight, Wallet, ArrowUpRight, PlusCircle
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../../components/ui/StatCard'
import Button from '../../components/ui/Button'

const MONTHLY_TRENDS = [
  { month: 'Jan', income: 120000, expense: 80000 },
  { month: 'Feb', income: 250000, expense: 110000 },
  { month: 'Mar', income: 180000, expense: 95000 },
  { month: 'Apr', income: 320000, expense: 140000 },
  { month: 'May', income: 210000, expense: 105000 },
  { month: 'Jun', income: 280000, expense: 130000 }
]

const DONATION_DISTRIBUTION = [
  { name: 'Devdravya', value: 450000 },
  { name: 'Jivdaya', value: 300000 },
  { name: 'General', value: 150000 },
  { name: 'Pathshala', value: 100000 }
]

const COLORS = ['#0d9488', '#10b981', '#0891b2', '#4f46e5']

const RECENT_ACTIVITIES = [
  { donor: 'Rajesh Shah', type: 'Devdravya', amount: 51000, date: '10 Apr', status: 'Verified', initial: 'RS' },
  { donor: 'Vimal Mehta', type: 'Jivdaya', amount: 25000, date: '09 Apr', status: 'Pending', initial: 'VM' },
  { donor: 'Amit Sanghavi', type: 'General', amount: 11000, date: '08 Apr', status: 'Verified', initial: 'AS' }
]

const QUICK_LINKS = [
  { icon: Building2, label: 'Organizations', to: '/organizations', color: 'from-blue-500/10 to-blue-600/5', iconCol: 'text-blue-600' },
  { icon: MapPin, label: 'Locations', to: '/locations/states', color: 'from-teal-500/10 to-teal-600/5', iconCol: 'text-teal-600' },
  { icon: UserPlus, label: 'Add Member', to: '/members/add', color: 'from-indigo-500/10 to-indigo-600/5', iconCol: 'text-indigo-600' },
  { icon: HandHeart, label: 'Donations', to: '/finance/donations', color: 'from-emerald-500/10 to-emerald-600/5', iconCol: 'text-emerald-600' },
  { icon: FileText, label: 'Reports', to: '/reports', color: 'from-rose-500/10 to-rose-600/5', iconCol: 'text-rose-600' },
  { icon: Settings, label: 'Settings', to: '/settings', color: 'from-slate-500/10 to-slate-600/5', iconCol: 'text-slate-600' }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const totalInc = MONTHLY_TRENDS.reduce((s, m) => s + m.income, 0)
  const totalExp = MONTHLY_TRENDS.reduce((s, m) => s + m.expense, 0)

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 bg-white min-h-screen font-sans pb-10">
      
      {/* ── TOP HEADER ── */}
      <div className="px-5 lg:px-7 pt-8 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent tracking-tight leading-tight">Dashboard</h1>
            <p className="text-[12px] font-semibold text-slate-400 mt-0.5 uppercase tracking-[0.1em]">System Overview & Analytics</p>
          </div>
          <Button 
            size="sm" icon={PlusCircle} 
            className="bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-xl font-bold px-6 h-11 transition-all active:scale-95 shadow-sm"
            onClick={() => navigate('/events/add')}
          >
            New Event
          </Button>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {QUICK_LINKS.map((item, i) => (
            <button key={i} onClick={() => navigate(item.to)} 
              className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-100 bg-white hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className={`w-6 h-6 ${item.iconCol}`} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-bold text-slate-500 group-hover:text-teal-600 transition-colors uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Sanghs" value="124" icon={Building2} color="teal" />
          <StatCard title="Total Members" value="12,450" icon={Users} color="emerald" />
          <StatCard title="Donations" value="₹24.8L" icon={HandHeart} color="teal" />
          <StatCard title="Total Trusts" value="86" icon={Landmark} color="emerald" />
        </div>

        {/* CHARTS Section */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-[70%] bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-[14.5px] font-bold text-slate-700 uppercase tracking-widest mb-8">Financial Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_TRENDS}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/><stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)'}} />
                  <Area type="monotone" dataKey="income" stroke="#0d9488" strokeWidth={4} fill="url(#chartGrad)" isAnimationActive={true} animationDuration={1200} />
                  <Area type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={2} fill="transparent" strokeDasharray="6 6" isAnimationActive={true} animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:w-[30%] bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-[15px] font-bold text-slate-700 uppercase tracking-widest mb-10">Donation Type</h3>
            <div className="w-full flex justify-center flex-1">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={DONATION_DISTRIBUTION} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" strokeWidth={0} isAnimationActive={true} animationDuration={1000}>
                    {DONATION_DISTRIBUTION.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-8 w-full px-2">
              {DONATION_DISTRIBUTION.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.name}</span>
                  </div>
                  <span className="text-[15px] font-bold text-slate-700">₹{(item.value / 1000)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION - ALIGNED & SYMMETRICAL ── */}
      <div className="px-5 lg:px-7 py-4">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Activity Box */}
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-slate-700 uppercase tracking-widest">Recent Activity</h3>
              <button className="text-teal-600 hover:text-emerald-600 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest transition-colors">
                View <ArrowUpRight size={14} strokeWidth={3} />
              </button>
            </div>
            <hr className="border-slate-200 mb-9" /> {/* Darker Horizontal Line */}
            
            <div className="space-y-8">
              {RECENT_ACTIVITIES.map((d, i) => (
                <div key={i} className="flex items-center justify-between h-[52px]">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shadow-lg shadow-emerald-100">
                      {d.initial}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-700 leading-none">{d.donor}</p>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-2">{d.type} • {d.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-bold text-slate-800 mb-2 font-sans">₹{d.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      d.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary Box - Matched with Left Side */}
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-700 uppercase tracking-widest mb-4">Financial Summary</h3>
            <hr className="border-slate-200 mb-9" /> {/* Darker Horizontal Line */}
            
            <div className="space-y-8">
              {/* Total Income - Aligned with RS */}
              <div className="flex items-center justify-between h-[52px] group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105"><TrendingUp size={22} /></div>
                  <span className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">Total Income</span>
                </div>
                <span className="text-[16px] font-bold text-emerald-600 font-sans tracking-tight">₹{(totalInc / 100000).toFixed(2)}L</span>
              </div>

              {/* Total Expense - Aligned with VM */}
              <div className="flex items-center justify-between h-[52px] group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center transition-transform group-hover:scale-105"><ArrowDownRight size={22} /></div>
                  <span className="text-[14px] font-bold text-slate-500 uppercase tracking-wider">Total Expense</span>
                </div>
                <span className="text-[16px] font-bold text-rose-600 font-sans tracking-tight">₹{(totalExp / 100000).toFixed(2)}L</span>
              </div>

              {/* Net Balance - Bottom Part */}
              <div className="flex items-center justify-between h-[52px] pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-100"><Wallet size={22} /></div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Net Balance</span>
                    <span className="text-[13px] font-bold text-teal-700 uppercase tracking-tighter">Consolidated</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-teal-600 tracking-tighter font-sans">₹{((totalInc - totalExp) / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}