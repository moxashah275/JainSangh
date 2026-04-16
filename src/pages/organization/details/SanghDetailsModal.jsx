import React from 'react';
import { X, Link2, MapPin, Users, User, Phone } from 'lucide-react';
import StatusToggle from '../../../components/common/StatusToggle';
import { getTrustName } from '../orgData';

export default function SanghDetailsModal({ isOpen, onClose, sangh, allData, onStatusToggle }) {
  if (!isOpen || !sangh) return null;

  const linkedTrusts = allData.links.filter(l => l.sanghId === sangh.id && l.status);

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
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800">Sangh Details</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-12 w-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{sangh.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase">{sangh.type}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${sangh.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {sangh.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <DetailItem icon={MapPin} label="City" value={sangh.city} />
            <DetailItem icon={Users} label="Members" value={sangh.members?.toLocaleString()} />
            <DetailItem icon={User} label="Sangh Head" value={sangh.sanghHead} />
            <DetailItem icon={Phone} label="Head Contact" value={sangh.headContact} />
            <div className="col-span-2 p-3 bg-slate-50 rounded-xl">
              <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Address</p>
              <p className="text-[13px] font-semibold text-slate-700">{sangh.address}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Link2 size={14} className="text-emerald-600" /> Linked Trusts ({linkedTrusts.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {linkedTrusts.length > 0 ? linkedTrusts.map(link => (
                <div key={link.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                  <span className="text-[12px] font-semibold text-slate-700">{getTrustName(link.trustId, allData.trusts)}</span>
                  <span className="px-2 py-0.5 bg-white rounded text-[9px] font-bold text-emerald-600 shadow-sm">Active</span>
                </div>
              )) : <p className="text-xs text-slate-400 italic">No linked trusts found.</p>}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Quick Status</p>
                <p className={`text-[12px] font-medium ${sangh.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {sangh.status ? 'Active' : 'Inactive'}
                </p>
              </div>
              <StatusToggle status={sangh.status} onToggle={() => onStatusToggle(sangh.id, 'sangh', sangh.status)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}