import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Plus, Trash2, Eye, Upload, FileText, User, Phone, Mail, MapPin } from 'lucide-react';
import Input from '../../../components/common/Input';
import CustomDropdown from '../../../components/common/CustomDropdown';
import StatusToggle from '../../../components/common/StatusToggle';
import { getOrgData } from '../orgData';

// નવું ટ્રસ્ટ ફોર્મ ક્લીન રાખવા માટેનું સ્ટેટ
const emptyTrustState = {
  name: '',
  mainContactPerson: '',
  mobile: '',
  email: '',
  address: '',
  area: '',
  city: '',
  state: '',
  about: '',
  totalMembers: '',
  team: [],
  document: null,
  linkedSanghs: [],
  status: true
};

export default function TrustFormModal({ isOpen, onClose, initialData, onSave }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sanghs, setSanghs] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState(emptyTrustState);

  useEffect(() => {
    if (!isOpen) return;
    
    // સંઘ ડેટા લોડ કરો (લિંકિંગ માટે)
    const data = getOrgData();
    setSanghs(data.sanghs || []);
    
    if (initialData) {
      setFormData({
        ...initialData,
        totalMembers: initialData.totalMembers || ''
      });
      setUploadedFile(initialData.document);
    } else {
      setFormData(emptyTrustState);
      setUploadedFile(null);
      setActiveTab('overview');
      setEditingMember(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTeamAdd = () => {
    setEditingMember({ id: Date.now(), name: '', designation: '', mobile: '', email: '', area: '', city: '', status: true });
  };

  const handleTeamSave = () => {
    if (editingMember) {
      if (formData.team.find(m => m.id === editingMember.id)) {
        setFormData(prev => ({
          ...prev,
          team: prev.team.map(m => m.id === editingMember.id ? editingMember : m)
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          team: [...prev.team, editingMember]
        }));
      }
    }
    setEditingMember(null);
  };

  const handleTeamEdit = (member) => {
    setEditingMember({ ...member });
  };

  const handleTeamRemove = (id) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m.id !== id)
    }));
  };

  const handleTeamChange = (field, value) => {
    setEditingMember(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileObj = {
        title: formData.document?.title || '',
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        file: file
      };
      setUploadedFile(fileObj);
      setFormData(prev => ({ ...prev, document: fileObj }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, document: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const TabButton = ({ tab, label }) => (
    <button 
      type="button"
      onClick={() => setActiveTab(tab)} 
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
    >
      {label}
    </button>
  );

  const designationOptions = ['Trustee', 'President', 'Vice President', 'Secretary', 'Treasurer', 'Manager'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
            </button>
            <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Edit Trust' : 'Create New Trust'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 flex gap-2">
          <TabButton tab="overview" label="Overview" />
          <TabButton tab="team" label="Team Members" />
          <TabButton tab="document" label="Document" />
          <TabButton tab="linked" label="Linked Sanghs" />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Trust Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex. Shree Shanti Charitable Trust" />
                <Input label="Main Contact Person" required value={formData.mainContactPerson} onChange={e => setFormData({...formData, mainContactPerson: e.target.value})} placeholder="Full name" />
                <Input label="Mobile Number" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} placeholder="98765 43210" />
                <Input label="Email Address" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="trust@example.com" />
                <div className="col-span-2">
                  <Input label="Office Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street address, Landmark..." />
                </div>
                <Input label="Area" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Area" />
                <Input label="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" />
                <Input label="State" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="State" />
                <Input label="Total Members" type="number" value={formData.totalMembers} onChange={e => setFormData({...formData, totalMembers: e.target.value})} placeholder="0" />
                <div className="col-span-2">
                  <Input label="About Trust" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} placeholder="Description of trust activities..." textarea rows={3} />
                </div>
                <div className="col-span-2">
                  <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Trust Status</label>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">{formData.status ? 'Active' : 'Inactive'}</span>
                    <StatusToggle status={formData.status} onToggle={() => setFormData({...formData, status: !formData.status})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members Tab */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              {formData.team.map((member) => (
                <div key={member.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <User size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{member.name}</h4>
                          <p className="text-xs text-emerald-600 font-medium">{member.designation}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Phone size={11} /> {member.mobile}</span>
                        <span className="flex items-center gap-1"><Mail size={11} /> {member.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleTeamEdit(member)} className="p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button type="button" onClick={() => handleTeamRemove(member.id)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {editingMember && (
                <div className="p-4 bg-white rounded-xl border-2 border-emerald-100">
                  <h4 className="font-bold text-slate-700 mb-4">{formData.team.find(m => m.id === editingMember.id) ? 'Edit Team Member' : 'Add New Team Member'}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Full Name" value={editingMember.name} onChange={e => handleTeamChange('name', e.target.value)} placeholder="Name" />
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-medium text-slate-600">Designation</label>
                      <CustomDropdown
                        value={editingMember.designation}
                        onChange={(val) => handleTeamChange('designation', val)}
                        placeholder="Select Role"
                        items={designationOptions.map(o => ({ label: o, value: o }))}
                        searchable={false}
                      />
                    </div>
                    <Input label="Mobile" value={editingMember.mobile} onChange={e => handleTeamChange('mobile', e.target.value)} placeholder="Mobile no" />
                    <Input label="Email" value={editingMember.email} onChange={e => handleTeamChange('email', e.target.value)} placeholder="Email address" />
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button type="button" onClick={handleTeamSave} className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 uppercase tracking-wider transition-all">Save Member</button>
                    <button type="button" onClick={() => setEditingMember(null)} className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50 uppercase tracking-wider transition-all">Cancel</button>
                  </div>
                </div>
              )}

              {!editingMember && (
                <button type="button" onClick={handleTeamAdd} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 transition-all">
                  <Plus size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Add Team Member</span>
                </button>
              )}
            </div>
          )}

          {/* Document Tab */}
          {activeTab === 'document' && (
            <div className="space-y-4">
              <Input label="Document Title" value={formData.document?.title || ''} onChange={e => setFormData({...formData, document: {...(formData.document || {}), title: e.target.value}})} placeholder="Ex. Trust Deed" />
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group">
                <input type="file" id="trust-file" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="trust-file" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Upload size={24} className="text-slate-400 group-hover:text-emerald-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-600">Choose Trust Document</span>
                  <span className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                </label>
              </div>
              {uploadedFile && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-emerald-600" />
                    <div>
                        <p className="text-sm font-semibold text-slate-700">{uploadedFile.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Document Attached</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveFile} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
          )}

          {/* Linked Sanghs Tab */}
          {activeTab === 'linked' && (
            <div className="space-y-3">
              {formData.linkedSanghs.length > 0 ? (
                formData.linkedSanghs.map(sanghId => {
                  const sangh = sanghs.find(s => s.id === sanghId);
                  return sangh ? (
                    <div key={sangh.id} className="p-4 bg-white rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{sangh.name}</h4>
                          <p className="text-[11px] text-slate-500">{sangh.city}, {sangh.state}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sangh.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {sangh.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ) : null;
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MapPin size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-500">No sanghs are linked to this trust yet</p>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-[13px] font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all uppercase">Cancel</button>
            <button type="submit" className="px-8 py-2.5 text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-100 transition-all uppercase tracking-wider">
              {initialData ? 'Update Trust' : 'Create Trust'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}