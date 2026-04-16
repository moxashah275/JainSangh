import React from 'react';
import { X, Link2, MapPin, Phone, User, Building2 } from 'lucide-react';
import StatusToggle from '../../../components/common/StatusToggle';
import { getSanghName } from '../orgData';

export default function TrustDetailsModal({ isOpen, onClose, trust, allData, onStatusToggle }) {
  if (!isOpen || !trust) return null;

  const linkedSanghs = allData.links.filter(l => l.trustId === trust.id && l.status);

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="p-3 bg-slate-50 rounded-xl">
      <p className="text-[10px] font-medium text-slate-400 uppercase mb-1 flex items-center gap-1">
        <Icon size={12} /> {label}
      </p>
      <p className="text-[13px] font-semibold text-slate-700">{value || '---'}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800">Trust Details</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        {/* Content - No scroll needed, fits naturally */}
        <div className="p-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{trust.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase">{trust.code}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${trust.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {trust.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <DetailItem icon={User} label="Admin" value={trust.admin} />
            <DetailItem icon={Phone} label="Phone" value={trust.phone} />
            <DetailItem icon={MapPin} label="City" value={trust.city} />
            <div className="col-span-2 p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Address</p>
              <p className="text-[13px] font-semibold text-slate-700">{trust.address}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Link2 size={14} className="text-emerald-600" /> Linked Sanghs ({linkedSanghs.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {linkedSanghs.length > 0 ? linkedSanghs.map(link => (
                <div key={link.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-slate-700">{getSanghName(link.sanghId, allData.sanghs)}</span>
                  <span className="px-2 py-0.5 bg-white rounded text-[9px] font-bold text-emerald-600 shadow-sm">Active</span>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No linked sanghs found.</p>}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Quick Status</p>
                <p className={`text-[12px] font-medium ${trust.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {trust.status ? 'Active' : 'Inactive'}
                </p>
              </div>
              <StatusToggle status={trust.status} onToggle={() => onStatusToggle(trust.id, 'trust', trust.status)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}