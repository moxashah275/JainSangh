import React from 'react';
import { Building2, Users2, Link2 } from 'lucide-react';
import { INITIAL_TRUSTS, INITIAL_SANGHS } from './orgData';

export default function OrgOverview() {
  const stats = {
    trusts: INITIAL_TRUSTS.length,
    sanghs: INITIAL_SANGHS.length,
    linked: INITIAL_SANGHS.filter(s => s.trustId).length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <OverviewCard label="Total Trusts" val={stats.trusts} icon={Building2} color="emerald" />
      <OverviewCard label="Total Sanghs" val={stats.sanghs} icon={Users2} color="teal" />
      <OverviewCard label="Linked Units" val={stats.linked} icon={Link2} color="cyan" />
    </div>
  );
}

function OverviewCard({ label, val, icon: Icon, color }) {
  return (
    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{val}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-white text-emerald-500 shadow-sm`}><Icon size={24} /></div>
    </div>
  );
}