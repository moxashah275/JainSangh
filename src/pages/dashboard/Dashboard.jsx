import { useNavigate } from 'react-router-dom'
import {
  HandHeart, Users, Landmark, MapPin, 
  Building2, UserPlus, Receipt, FileText, 
  Settings, BarChart3, CalendarDays, TrendingUp, 
  ArrowDownRight, Wallet, ArrowUpRight, PlusCircle, Sparkles
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'

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

const COLORS = ['#0d9488', '#059669', '#0891b2', '#4f46e5']

const RECENT_ACTIVITIES = [
  { donor: 'Rajesh Shah', type: 'Devdravya', amount: 51000, date: '10 Apr', status: 'Verified', initial: 'RS' },
  { donor: 'Vimal Mehta', type: 'Jivdaya', amount: 25000, date: '09 Apr', status: 'Pending', initial: 'VM' },
  { donor: 'Amit Sanghavi', type: 'General', amount: 11000, date: '08 Apr', status: 'Verified', initial: 'AS' }
]

const QUICK_LINKS = [
  { icon: Building2, label: 'Organizations', to: '/organizations', bg: 'bg-blue-50', tx: 'text-blue-600' },
  { icon: MapPin, label: 'Locations', to: '/locations/states', bg: 'bg-teal-50', tx: 'text-teal-600' },
  { icon: UserPlus, label: 'Add Member', to: '/members/add', bg: 'bg-indigo-50', tx: 'text-indigo-600' },
  { icon: HandHeart, label: 'Donations', to: '/finance/donations', bg: 'bg-emerald-50', tx: 'text-emerald-600' },
  { icon: FileText, label: 'Reports', to: '/reports', bg: 'bg-rose-50', tx: 'text-rose-600' },
  { icon: Settings, label: 'Settings', to: '/settings', bg: 'bg-slate-100', tx: 'text-slate-600' }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const totalInc = MONTHLY_TRENDS.reduce((s, m) => s + m.income, 0)
  const totalExp = MONTHLY_TRENDS.reduce((s, m) => s + m.expense, 0)

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 bg-white min-h-screen animate-in fade-in duration-700 pb-10">
      
      {/* ── TOP HEADER ── */}
      <div className="px-5 lg:px-7 pt-8 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-teal-700 tracking-tight leading-none">Dashboard</h1>
            <p className="text-[11px] font-black text-slate-500 mt-1.5 uppercase tracking-[0.15em] leading-none">
              System Overview & Real-time Analytics
            </p>
          </div>

          <Button 
            size="sm" 
            icon={PlusCircle} 
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold px-4 h-10 shadow-md transition-all active:scale-95 hover:-translate-y-1"
            onClick={() => navigate('/organizations/add')}
          >
            Create New Sangh
          </Button>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {QUICK_LINKS.map((item, i) => (
            <button 
              key={i} 
              onClick={() => navigate(item.to)} 
              className="group flex flex-col items-center justify-center p-4 rounded-[1.5rem] border border-slate-100 bg-white hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.tx} flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-teal-600 transition-colors">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-1000">
          <StatCard title="Total Sanghs" value="124" icon={Building2} color="teal" trend="up" trendValue="+5" />
          <StatCard title="Total Members" value="12,450" icon={Users} color="indigo" trend="up" trendValue="+152" />
          <StatCard title="Donations" value="₹24.8L" icon={HandHeart} color="emerald" />
          <StatCard title="Total Trusts" value="86" icon={Landmark} color="sky" />
        </div>

        {/* CHARTS  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Financial Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-wider">Financial Overview</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"/> <span className="text-[10px] font-black text-slate-400 uppercase">Income</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"/> <span className="text-[10px] font-black text-slate-400 uppercase">Expense</span></div>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_TRENDS}>
                  <defs>
                    <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/><stop offset="95%" stopColor="#0d9488" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} />
                  
                  <Area type="monotone" dataKey="income" stroke="#0d9488" strokeWidth={4} fill="url(#colorInc)" isAnimationActive={true} animationDuration={2500} animationBegin={200} />
                  <Area type="monotone" dataKey="expense" stroke="#e11d48" strokeWidth={2} fill="transparent" strokeDasharray="6 6" isAnimationActive={true} animationDuration={3000} animationBegin={400} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donation Pie Chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col hover:shadow-md transition-all">
            <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-wider mb-2 text-center">Donation By Type</h3>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  
                  <Pie 
                    data={DONATION_DISTRIBUTION} 
                    innerRadius={60} 
                    outerRadius={85} 
                    paddingAngle={8} 
                    dataKey="value" 
                    strokeWidth={0} 
                    isAnimationActive={true}
                    animationBegin={500}
                    animationDuration={2000}
                  >
                    {DONATION_DISTRIBUTION.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {DONATION_DISTRIBUTION.map((item, i) => (
                <div key={i} className="bg-slate-50 p-2 rounded-xl flex flex-col items-start px-3 transition-colors hover:bg-slate-100 cursor-default">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">₹{(item.value / 1000)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="bg-slate-50/50 border-t border-slate-100 px-5 lg:px-7 py-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800">Recent Transactions</h3>
              <button className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-all">
                View All <ArrowUpRight size={14} strokeWidth={3} />
              </button>
            </div>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl hover:border-teal-100 hover:shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      {d.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 tracking-tight leading-none mb-1">{d.donor}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.type} • {d.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-black text-slate-900 leading-none mb-1.5">₹{d.amount.toLocaleString()}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${d.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <h3 className="text-lg font-black text-slate-800 mb-6">Consolidated Finance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50 h-[75px] group hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:rotate-12 transition-transform"><TrendingUp size={20} /></div>
                  <span className="text-[10px] font-black text-emerald-800 uppercase">Collection</span>
                </div>
                <span className="text-xl font-black text-emerald-700">₹{(totalInc / 100000).toFixed(2)}L</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-rose-50/50 rounded-2xl border border-rose-50 h-[75px] group hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center group-hover:-rotate-12 transition-transform"><ArrowDownRight size={20} /></div>
                  <span className="text-[10px] font-black text-rose-800 uppercase">Expenses</span>
                </div>
                <span className="text-xl font-black text-rose-700">₹{(totalExp / 100000).toFixed(2)}L</span>
              </div>

              <div className="flex items-center justify-between p-5 bg-teal-600 rounded-2xl h-[85px] shadow-lg shadow-teal-900/10 mt-2 hover:shadow-teal-900/20 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform"><Wallet size={20} /></div>
                  <span className="text-[10px] font-black uppercase">Net Balance</span>
                </div>
                <span className="text-2xl font-black text-white">₹{((totalInc - totalExp) / 100000).toFixed(2)}L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}