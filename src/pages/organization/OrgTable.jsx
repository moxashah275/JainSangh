import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Edit2, Trash2, Eye, X, Check, AlertTriangle, ArrowLeft, ChevronDown } from 'lucide-react';
import StatusToggle from '../../components/common/StatusToggle';
import TrustFormModal from './forms/TrustFormModal';
import SanghFormModal from './forms/SanghFormModal';
import TrustDetailsModal from './details/TrustDetailsModal';
import SanghDetailsModal from './details/SanghDetailsModal';
import { getOrgData, saveOrgData, getTrustName, getSanghName } from './orgData';

const OrgTable = forwardRef(({ activeTab, searchTerm, onDataChange, refresh }, ref) => {
  const [data, setData] = useState(() => getOrgData());
  
  // Modals State
  const [trustModal, setTrustModal] = useState({ isOpen: false, type: 'add', data: null });
  const [sanghModal, setSanghModal] = useState({ isOpen: false, type: 'add', data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, type: '', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Sync Data
  useEffect(() => {
    setData(getOrgData());
    if (onDataChange) {
      onDataChange({
        Trusts: data.trusts.length,
        Sanghs: data.sanghs.length,
        Linked: data.links.length
      });
    }
  }, [refresh]);

  // Expose add functions to window for OrgIndex to trigger
  useImperativeHandle(ref, () => ({}), []);
  useEffect(() => {
    window.openTrustModal = () => setTrustModal({ isOpen: true, type: 'add', data: null });
    window.openSanghModal = () => setSanghModal({ isOpen: true, type: 'add', data: null });
    return () => { window.openTrustModal = null; window.openSanghModal = null; };
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // --- Handlers ---
  
  const handleSaveTrust = (formData) => {
    const newTrusts = [...data.trusts];
    if (trustModal.type === 'add') {
      // Duplicate Check
      if (newTrusts.some(t => t.name.toLowerCase() === formData.name.toLowerCase())) {
        showToast('Trust Name Already Exists', 'error');
        return;
      }
      newTrusts.push({ ...formData, id: Date.now(), status: true });
      showToast('Trust Added Successfully');
    } else {
      const idx = newTrusts.findIndex(t => t.id === trustModal.data.id);
      if (idx > -1) newTrusts[idx] = { ...newTrusts[idx], ...formData };
      showToast('Trust Updated Successfully');
    }
    setData({ ...data, trusts: newTrusts });
    saveOrgData({ ...data, trusts: newTrusts });
    setTrustModal({ isOpen: false, type: 'add', data: null });
  };

  const handleSaveSangh = (formData) => {
    const newSanghs = [...data.sanghs];
    if (sanghModal.type === 'add') {
      if (newSanghs.some(s => s.name.toLowerCase() === formData.name.toLowerCase())) {
        showToast('Sangh Name Already Exists', 'error');
        return;
      }
      newSanghs.push({ ...formData, id: Date.now(), status: true, members: 0 });
      showToast('Sangh Added Successfully');
    } else {
      const idx = newSanghs.findIndex(s => s.id === sanghModal.data.id);
      if (idx > -1) newSanghs[idx] = { ...newSanghs[idx], ...formData };
      showToast('Sangh Updated Successfully');
    }
    setData({ ...data, sanghs: newSanghs });
    saveOrgData({ ...data, sanghs: newSanghs });
    setSanghModal({ isOpen: false, type: 'add', data: null });
  };

  const handleDelete = () => {
    let updatedData = { ...data };
    if (deleteConfirm.type === 'trust') {
      updatedData.trusts = updatedData.trusts.filter(t => t.id !== deleteConfirm.id);
      updatedData.links = updatedData.links.filter(l => l.trustId !== deleteConfirm.id);
    } else {
      updatedData.sanghs = updatedData.sanghs.filter(s => s.id !== deleteConfirm.id);
      updatedData.links = updatedData.links.filter(l => l.sanghId !== deleteConfirm.id);
    }
    setData(updatedData);
    saveOrgData(updatedData);
    setDeleteConfirm({ show: false, id: null, type: '' });
    showToast('Deleted Successfully', 'error');
  };

  const toggleStatus = (id, type, currentStatus) => {
    const key = type === 'trust' ? 'trusts' : 'sanghs';
    const list = [...data[key]];
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) {
      list[idx].status = !currentStatus;
      setData({ ...data, [key]: list });
      saveOrgData({ ...data, [key]: list });
      showToast('Status Changed');
    }
  };

  // --- Filtering ---
  const currentList = activeTab === 'Trusts' ? data.trusts : data.sanghs;
  const filteredData = currentList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Columns Definition ---
  const renderHeader = () => {
    if (activeTab === 'Trusts') {
      return (
        <>
          <th className="w-1/4 px-6 py-2 text-center">Sr. No.</th>
          <th className="w-1/4 px-6 py-2 text-center">Trust Name</th>
          <th className="w-1/4 px-6 py-2 text-center">Admin / City</th>
          <th className="w-1/4 px-6 py-2 text-center">Status</th>
          <th className="w-1/4 px-6 py-2 text-center">Actions</th>
        </>
      );
    } else {
      return (
        <>
          <th className="w-1/4 px-6 py-2 text-center">Sr. No.</th>
          <th className="w-1/4 px-6 py-2 text-center">Sangh Name</th>
          <th className="w-1/4 px-6 py-2 text-center">City / Members</th>
          <th className="w-1/4 px-6 py-2 text-center">Status</th>
          <th className="w-1/4 px-6 py-2 text-center">Actions</th>
        </>
      );
    }
  };

  return (
    <div className="w-full font-sans antialiased text-slate-600">
      {/* Toast */}
      {toast.show && (
        <div className="fixed top-8 right-8 z-[999] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border border-emerald-400 bg-emerald-500 text-white backdrop-blur-md">
            <div className="p-1.5 rounded-lg bg-white/20">
              {toast.type === 'error' ? <AlertTriangle size={18} className="text-white" /> : <Check size={18} strokeWidth={3} className="text-white" />}
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] font-medium uppercase tracking-wide leading-none">{toast.message}</span>
              <span className="text-[9px] font-normal opacity-80 uppercase mt-1 tracking-widest">System Notification</span>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
              {renderHeader()}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length > 0 ? filteredData.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="w-1/4 px-6 py-3 text-center text-sm font-medium text-slate-500 align-middle">{idx + 1}</td>
                <td className="w-1/4 px-6 py-3 text-center text-sm font-bold text-slate-700 align-middle">{row.name}</td>
                <td className="w-1/4 px-6 py-3 text-center text-xs text-slate-500 align-middle">
                  {activeTab === 'Trusts' ? (
                    <div>
                      <div className="font-bold text-slate-700">{row.admin}</div>
                      <div className="mt-1">{row.city}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-bold text-slate-700">{row.city}</div>
                      <div className="mt-1 text-[10px] uppercase tracking-wider">{row.members} Members</div>
                    </div>
                  )}
                </td>
                <td className="w-1/4 px-6 py-3 text-center align-middle">
                  <div className="flex items-center justify-center">
                    <StatusToggle status={row.status} onToggle={() => toggleStatus(row.id, activeTab === 'Trusts' ? 'trust' : 'sangh', row.status)} />
                  </div>
                </td>
                <td className="w-1/4 px-6 py-3 text-center align-middle">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setDetailsModal({ isOpen: true, type: activeTab === 'Trusts' ? 'trust' : 'sangh', data: row })} className="text-slate-400 hover:text-emerald-600 transition-all p-1 hover:bg-emerald-50 rounded-full"><Eye size={15} /></button>
                    <button 
                      onClick={() => activeTab === 'Trusts' 
                        ? setTrustModal({ isOpen: true, type: 'edit', data: row }) 
                        : setSanghModal({ isOpen: true, type: 'edit', data: row })} 
                      className="text-slate-400 hover:text-emerald-600 transition-all p-1 hover:bg-emerald-50 rounded-full"><Edit2 size={15} /></button>
                    <button onClick={() => setDeleteConfirm({ show: true, id: row.id, type: activeTab === 'Trusts' ? 'trust' : 'sangh' })} className="text-slate-400 hover:text-rose-500 transition-all p-1 hover:bg-rose-50 rounded-full"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="py-6 text-center text-sm text-slate-400">No matching records found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {trustModal.isOpen && <TrustFormModal isOpen={trustModal.isOpen} onClose={() => setTrustModal({ isOpen: false, type: 'add', data: null })} initialData={trustModal.data} onSave={handleSaveTrust} />}
      {sanghModal.isOpen && <SanghFormModal isOpen={sanghModal.isOpen} onClose={() => setSanghModal({ isOpen: false, type: 'add', data: null })} initialData={sanghModal.data} onSave={handleSaveSangh} />}
      {detailsModal.isOpen && detailsModal.type === 'trust' && <TrustDetailsModal isOpen={detailsModal.isOpen} onClose={() => setDetailsModal({ isOpen: false })} trust={detailsModal.data} allData={data} />}
      {detailsModal.isOpen && detailsModal.type === 'sangh' && <SanghDetailsModal isOpen={detailsModal.isOpen} onClose={() => setDetailsModal({ isOpen: false })} sangh={detailsModal.data} allData={data} />}

      {/* Delete Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[280px] rounded-[24px] p-6 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} /></div>
            <h3 className="font-medium text-slate-800 text-sm">Confirm Delete?</h3>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setDeleteConfirm({ show: false, id: null, type: '' })} className="flex-1 py-2 text-xs font-medium text-slate-400 bg-slate-50 rounded-xl">No</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-xs font-medium text-white bg-rose-500 rounded-xl shadow-lg">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default OrgTable;