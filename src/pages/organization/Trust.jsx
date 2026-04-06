import { Building, ShieldCheck, CreditCard, ExternalLink } from 'lucide-react'

export default function Trust() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Trust Management</h1>
        <p className="text-sm text-slate-500">Central corporate management for Pedhi</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-lg">AK</div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Sheth Anandji Kalyanji Pedhi</h2>
            <p className="text-sm text-slate-400">Head Office: Ahmedabad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Total Managed Tirthas</p>
            <p className="text-sm font-semibold text-slate-700">1200+ Temples</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Structure Type</p>
            <p className="text-sm font-semibold text-slate-700">9 Active Trustees</p>
          </div>
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-800 mt-8 mb-4">Core Funds (7 Kshetras)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Building, label: 'Dev Dravya', desc: 'Temple & Idol Upkeep' },
          { icon: ShieldCheck, label: 'Sadhu Raksha', desc: 'Care for Monks' },
          { icon: CreditCard, label: 'Anukampa', desc: 'Helping Poor/Needy' },
          { icon: ExternalLink, label: 'General Fund', desc: 'Administrative Costs' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
              <item.icon className="w-4 h-4 text-teal-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}