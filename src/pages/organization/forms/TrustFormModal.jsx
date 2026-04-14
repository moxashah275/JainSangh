import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TrustFormModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({ name: '', code: '', admin: '', phone: '', address: '', city: '', status: true });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', code: '', admin: '', phone: '', address: '', city: '', status: true });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Edit Trust' : 'Create New Trust'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Trust Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all" placeholder="e.g. Shree Jain Trust" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Trust Code</label>
              <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="T-001" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">City</label>
              <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="City Name" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Admin Name</label>
              <input required type="text" value={formData.admin} onChange={e => setFormData({...formData, admin: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="Main Trustee" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Phone</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none" placeholder="+91..." />
            </div>
            <div className="col-span-2">
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Address</label>
              <textarea required rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-50">
            <button type="button" onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-5 py-2 text-[13px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-100 transition-all">Save Trust</button>
          </div>
        </form>
      </div>
    </div>
  );
}