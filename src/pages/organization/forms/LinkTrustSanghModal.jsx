import React, { useEffect, useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import CustomDropdown from '../../../components/common/CustomDropdown';

export default function LinkTrustSanghModal({ isOpen, onClose, trusts, sanghs, onLink }) {
  const [trustId, setTrustId] = useState('');
  const [sanghId, setSanghId] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setTrustId('');
    setSanghId('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!trustId || !sanghId) return;
    onLink(trustId, sanghId);
    setTrustId('');
    setSanghId('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
            </button>
            <h3 className="text-lg font-bold text-slate-800">Link Trust & Sangh</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Select Trust</label>
            <CustomDropdown
              value={trustId}
              onChange={setTrustId}
              placeholder="Choose a Trust"
              items={trusts.map((trust) => ({ label: trust.name, value: String(trust.id) }))}
              searchable={false}
              className="w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Select Sangh</label>
            <CustomDropdown
              value={sanghId}
              onChange={setSanghId}
              placeholder="Choose a Sangh"
              items={sanghs.map((sangh) => ({ label: sangh.name, value: String(sangh.id) }))}
              searchable={false}
              className="w-full"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100">Link Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
