import React from 'react';
import { X, Link2, MapPin, Users, Building2 } from 'lucide-react';
import { getTrustName, getSanghName } from '../orgData';

export default function SanghDetailsModal({ isOpen, onClose, sangh, allData }) {
  if (!isOpen || !sangh) return null;

  const linkedTrusts = allData.links.filter(l => l.sanghId === sangh.id && l.status);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">Sangh Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0"><Users size={32} /></div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{sangh.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase">{sangh.type}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sangh.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{sangh.status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DetailItem icon={MapPin} label="City" value={sangh.city} />
            <DetailItem icon={Users} label="Members" value={sangh.members} />
            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Address</p>
              <p className="text-sm font-semibold text-slate-700">{sangh.address}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Link2 size={16} className="text-teal-600" /> Linked Trusts ({linkedTrusts.length})</h4>
            <div className="space-y-2">
              {linkedTrusts.length > 0 ? linkedTrusts.map(link => (
                <div key={link.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">{getTrustName(link.trustId, allData.trusts)}</span>
                  <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-emerald-600 shadow-sm">Active</span>
                </div>
              )) : <p className="text-sm text-slate-400 italic">No linked trusts found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Icon size={12} /> {label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
);