import React from 'react';
import { Briefcase, UserCircle2, Users } from 'lucide-react';
import { INITIAL_DEPARTMENTS } from './orgData';

export default function Departments() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Departments</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Internal Unit Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_DEPARTMENTS.map((dept) => (
          <div key={dept.id} className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-50 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-emerald-500 group-hover:opacity-10 transition-all duration-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{dept.name}</h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase">System Active</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dept Head</span>
                <span className="text-xs font-black text-slate-700">{dept.head}</span>
              </div>
              <div className="flex justify-between px-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Staff Count</span>
                <span className="text-xs font-black text-slate-700">{dept.members} Members</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}