import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Input from '../../../components/common/Input';
import StatusToggle from '../../../components/common/StatusToggle';

export default function SanghFormModal({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({ 
    name: '', city: '', members: 0, address: '', type: 'Main', sanghHead: '', headContact: '', status: true 
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', city: '', members: 0, address: '', type: 'Main', sanghHead: '', headContact: '', status: true });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Edit Sangh' : 'Add New Sangh'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Input label="Sangh Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Enter sangh name" />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City Name" />
            <div className="space-y-1.5">
              <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none">
                <option value="Main">Main Sangh</option>
                <option value="Regional">Regional Sangh</option>
              </select>
            </div>
            <Input label="Sangh Head" value={formData.sanghHead} onChange={e => setFormData({...formData, sanghHead: e.target.value})} placeholder="Head name" />
            <Input label="Head Contact" value={formData.headContact} onChange={e => setFormData({...formData, headContact: e.target.value})} placeholder="Contact number" />
            <Input label="Total Members" type="number" value={formData.members} onChange={e => setFormData({...formData, members: parseInt(e.target.value) || 0})} placeholder="0" />
          </div>
          
          <Input label="Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Full address" />
          
          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Status</label>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-medium text-slate-700">{formData.status ? 'Active' : 'Inactive'}</span>
              <StatusToggle status={formData.status} onToggle={() => setFormData({...formData, status: !formData.status})} />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-50">
            <button type="button" onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-5 py-2 text-[13px] font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-100 transition-all">
              {initialData ? 'Update Sangh' : 'Create Sangh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}