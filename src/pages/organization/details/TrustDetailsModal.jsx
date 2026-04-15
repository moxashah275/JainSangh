import React from 'react';
import { X, Link2, MapPin, Phone, User, Building2 } from 'lucide-react';
import { getTrustName, getSanghName } from '../orgData';

export default function TrustDetailsModal({ isOpen, onClose, trust, allData }) {
  if (!isOpen || !trust) return null;

  const linkedSanghs = allData.links.filter(l => l.trustId === trust.id && l.status);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-bold text-slate-800">Trust Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Building2 size={32} /></div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">{trust.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{trust.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${trust.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{trust.status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <DetailItem icon={User} label="Admin" value={trust.admin} />
            <DetailItem icon={Phone} label="Phone" value={trust.phone} />
            <DetailItem icon={MapPin} label="City" value={trust.city} />
            <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 col-span-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Address</p>
              <p className="text-sm font-semibold text-slate-700">{trust.address}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Link2 size={16} className="text-teal-600" /> Linked Sanghs ({linkedSanghs.length})</h4>
            <div className="space-y-2">
              {linkedSanghs.length > 0 ? linkedSanghs.map(link => (
                <div key={link.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">{getSanghName(link.sanghId, allData.sanghs)}</span>
                  <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-emerald-600 shadow-sm">Active</span>
                </div>
              )) : <p className="text-sm text-slate-400 italic">No linked sanghs found.</p>}
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