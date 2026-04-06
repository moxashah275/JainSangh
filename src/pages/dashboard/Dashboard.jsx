import { useNavigate } from 'react-router-dom'
import {
  HandHeart, Users, Landmark, Gem, ArrowUpRight,
  IndianRupee, UserPlus, Receipt, FileText, BookOpen,
  BarChart3, CalendarDays, TrendingUp, ArrowDownRight, Wallet
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'

// ── Data ──
const MONTHLY = [
  { month: 'Jan', income: 86000, expense: 62000 },
  { month: 'Feb', income: 183000, expense: 95000 },
  { month: 'Mar', income: 83000, expense: 72000 },
  { month: 'Apr', income: 145000, expense: 88000 },
  { month: 'May', income: 97000, expense: 54000 },
  { month: 'Jun', income: 112000, expense: 67000 }
]

const BY_TYPE = [
  { name: 'Devdravya', value: 72000 },
  { name: 'Jivdaya', value: 100000 },
  { name: 'Derasar', value: 101000 },
  { name: 'Pathshala', value: 10000 },
  { name: 'Aayambil', value: 31000 }
]

const COLORS = ['#0d9488', '#059669', '#e11d48', '#8b5cf6', '#d97706']

const RECENT = [
  { id: 1, donor: 'Rajesh Shah', type: 'Devdravya', amount: 51000, date: '05 Mar', status: 'Verified' },
  { id: 2, donor: 'Meena Patel', type: 'Jivdaya', amount: 25000, date: '04 Mar', status: 'Pending' },
  { id: 3, donor: 'Suresh Jain', type: 'Pathshala', amount: 10000, date: '03 Mar', status: 'Verified' },
  { id: 4, donor: 'Aarav Mehta', type: 'Derasar', amount: 76000, date: '01 Mar', status: 'Verified' }
]

const EVENTS = [
  { name: 'Mahaveer Jayanti', date: '2026-04-13', type: 'Festival' },
  { name: 'Kartak Sud Poonam', date: '2026-11-05', type: 'Salgirah' },
  { name: 'Paryushan Parva', date: '2026-08-28', type: 'Festival' }
]

const QUICK = [
  { icon: FileText, label: 'Upload Doc', to: '/donations', c: 'violet' },
  { icon: IndianRupee, label: 'New Donation', to: '/donations/add', c: 'teal' },
  { icon: UserPlus, label: 'Add Member', to: '/masters/sangh', c: 'sky' },
  { icon: Receipt, label: 'Post Expense', to: '/reports/expenses', c: 'rose' },
  { icon: BookOpen, label: 'Exam', to: '/pathshala/exams', c: 'amber' },
  { icon: BarChart3, label: 'Reports', to: '/reports/analytics', c: 'emerald' }
]

const QClr = {
  teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600',    hv: 'group-hover:bg-teal-600 group-hover:text-white',    bd: 'hover:border-teal-200' },
  sky:     { bg: 'bg-sky-50',     icon: 'text-sky-600',     hv: 'group-hover:bg-sky-600 group-hover:text-white',     bd: 'hover:border-sky-200' },
  rose:    { bg: 'bg-rose-50',    icon: 'text-rose-600',    hv: 'group-hover:bg-rose-600 group-hover:text-white',    bd: 'hover:border-rose-200' },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  hv: 'group-hover:bg-violet-600 group-hover:text-white',  bd: 'hover:border-violet-200' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   hv: 'group-hover:bg-amber-600 group-hover:text-white',   bd: 'hover:border-amber-200' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hv: 'group-hover:bg-emerald-600 group-hover:text-white', bd: 'hover:border-emerald-200' }
}

const EClr = [
  { bg: 'bg-rose-50',  bd: 'border-rose-100',  tx: 'text-rose-600',  badge: 'bg-rose-100/60 text-rose-600' },
  { bg: 'bg-amber-50', bd: 'border-amber-100', tx: 'text-amber-600', badge: 'bg-amber-100/60 text-amber-600' },
  { bg: 'bg-sky-50',   bd: 'border-sky-100',   tx: 'text-sky-600',   badge: 'bg-sky-100/60 text-sky-600' }
]

// ── Local Components (To Keep Code Size Optimized) ──
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}>{children}</div>
)

const SectionHead = ({ title, sub, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
      {sub && <p className="text-[12px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
    {action}
  </div>
)

const FinRow = ({ icon: Icon, label, value, bg, border, iconBg, iconClr, valClr }) => (
  <div className={`flex items-center justify-between p-3.5 rounded-xl ${bg} border ${border}`}>
    <span className="flex items-center gap-3 text-[13px] font-medium text-slate-700">
      <span className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${iconClr}`} />
      </span>
      {label}
    </span>
    <span className={`text-[16px] font-bold ${valClr}`}>{value}</span>
  </div>
)

// Clean status badge with dynamic colors
const StatusTag = ({ status }) => {
  const isVer = status === 'Verified';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
      isVer ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
    }`}>
      {status}
    </span>
  );
}

// ── Main Dashboard Component ──
export default function Dashboard() {
  const navigate = useNavigate()
  const totalInc = MONTHLY.reduce((s, m) => s + m.income, 0)
  const totalExp = MONTHLY.reduce((s, m) => s + m.expense, 0)
  
  const tipStyle = { 
    borderRadius: '12px', border: '1px solid #e2e8f0', 
    fontSize: '12px', fontWeight: '600', padding: '10px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  }

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-6 pb-8 bg-[#fafafa] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold text-teal-700 tracking-tight">Dashboard</h1>
            <p className="text-[13px] font-medium text-slate-400 mt-0.5">Overview of Trust activities</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={CalendarDays}>Events</Button>
            <Button size="sm" icon={IndianRupee} onClick={() => navigate('/donations/add')}>Add Donation</Button>
          </div>
        </div>

        {/* ── 1. Quick Actions ── */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {QUICK.map((q) => {
            const s = QClr[q.c]
            return (
              <button key={q.label} onClick={() => navigate(q.to)}
                className={`group flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-slate-100 ${s.bd} hover:shadow-lg hover:shadow-slate-500/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer`}>
                <div className={`w-9 h-9 rounded-lg ${s.bg} ${s.icon} ${s.hv} flex items-center justify-center transition-all duration-300`}>
                  <q.icon className="w-4.5 h-4.5" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-700 text-center leading-tight">{q.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── 2. Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Donations" value="₹15.4L" icon={HandHeart} color="teal" trend="up" trendValue="+12.5%" />
          <StatCard title="Total Members" value="4,850" icon={Users} color="emerald" trend="up" trendValue="+3.2%" />
          <StatCard title="Net Balance" value="₹2.1L" icon={Landmark} color="sky" trend="up" trendValue="+18%" />
          <StatCard title="Derasar Active" value="3" icon={Gem} color="rose" />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Area Chart */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[15px] font-bold text-slate-800">Income vs Expense</h3>
                <p className="text-[12px] font-medium text-slate-400 mt-0.5">Monthly overview</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-600"><span className="w-2 h-2 rounded-full bg-teal-500" />Income</span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500"><span className="w-2 h-2 rounded-full bg-rose-500" />Expense</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0d9488" stopOpacity={0.12} /><stop offset="95%" stopColor="#0d9488" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e11d48" stopOpacity={0.06} /><stop offset="95%" stopColor="#e11d48" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip formatter={(v, n) => [`₹${v.toLocaleString()}`, n === 'income' ? 'Income' : 'Expense']} contentStyle={tipStyle} />
                <Area type="monotone" dataKey="income" stroke="#0d9488" strokeWidth={2} fill="url(#gI)" dot={false} activeDot={{ r: 5, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }} isAnimationActive animationDuration={1200} />
                <Area type="monotone" dataKey="expense" stroke="#e11d48" strokeWidth={1.5} fill="url(#gE)" dot={false} activeDot={{ r: 4, fill: '#e11d48', stroke: '#fff', strokeWidth: 2 }} isAnimationActive animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">Donation Type</h3>
              <p className="text-[12px] font-medium text-slate-400">This year breakdown</p>
            </div>

            <div className="flex-1 flex items-center justify-center mx-auto">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={BY_TYPE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" strokeWidth={0} isAnimationActive animationDuration={1200}>
                    {BY_TYPE.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
                  </Pie>
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`]} contentStyle={tipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {BY_TYPE.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    {item.name}
                  </span>
                  <span className="text-slate-700 font-bold">₹{(item.value / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Recent Donations ── */}
        <Card>
          <SectionHead
            title="Recent Donations"
            action={
              <button onClick={() => navigate('/donations')} className="flex items-center gap-1.5 text-[12px] font-bold text-teal-600 hover:text-teal-700 transition-colors">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="divide-y divide-slate-50">
            {RECENT.map((d) => (
              <div key={d.id} className="flex items-center justify-between py-3.5 px-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 font-semibold text-[12px] shrink-0">
                    {d.donor.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-700">{d.donor}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{d.type} · {d.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-bold text-slate-800">₹{d.amount.toLocaleString()}</p>
                  <div className="mt-0.5"><StatusTag status={d.status} /></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upcoming Events */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-slate-800">Upcoming Events</h3>
              <span className="text-[12px] font-semibold text-teal-600">{EVENTS.length} Active Events</span>
            </div>
            <div className="space-y-3">
              {EVENTS.map((evt, i) => {
                const ec = EClr[i]
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 hover:border-slate-100 transition-all cursor-pointer group">
                    <div className={`w-11 h-11 rounded-xl ${ec.bg} border ${ec.bd} flex flex-col items-center justify-center ${ec.tx} shrink-0`}>
                      <span className="uppercase text-[9px] font-bold tracking-wider">{new Date(evt.date).toLocaleString('en', { month: 'short' })}</span>
                      <span className="text-[15px] font-bold leading-none">{new Date(evt.date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-700 group-hover:text-teal-700 transition-colors truncate">{evt.name}</p>
                      <span className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ec.badge}`}>{evt.type}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Financial Summary */}
          <Card>
            <h3 className="text-[15px] font-bold text-slate-800 mb-5">Financial Summary</h3>
            <div className="space-y-3">
              <FinRow icon={TrendingUp} label="Total Income" value={`₹${(totalInc / 100000).toFixed(1)}L`} bg="bg-teal-50/50" border="border-teal-100/40" iconBg="bg-teal-100" iconClr="text-teal-600" valClr="text-teal-700" />
              <FinRow icon={ArrowDownRight} label="Total Expense" value={`₹${(totalExp / 100000).toFixed(1)}L`} bg="bg-rose-50/40" border="border-rose-100/40" iconBg="bg-rose-100" iconClr="text-rose-500" valClr="text-rose-600" />
              <FinRow icon={Wallet} label="Net Savings" value={`₹${((totalInc - totalExp) / 100000).toFixed(1)}L`} bg="bg-emerald-50/50" border="border-emerald-100/40" iconBg="bg-emerald-100" iconClr="text-emerald-600" valClr="text-emerald-700" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}