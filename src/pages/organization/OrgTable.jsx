import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Edit2, Trash2, Eye, X, Check, AlertTriangle, ArrowLeft, ChevronDown } from 'lucide-react';
import StatusToggle from '../../components/common/StatusToggle';
import TrustFormModal from './forms/TrustFormModal';
import SanghFormModal from './forms/SanghFormModal';
import TrustDetailsModal from './details/TrustDetailsModal';
import SanghDetailsModal from './details/SanghDetailsModal';
import { getOrgData, saveOrgData } from './orgData';

const OrgTable = forwardRef(({ activeTab, searchTerm, filterValues, itemsPerPage, currentPage, setCurrentPage, setTotalEntries, onDataChange }, ref) => {
  const [data, setData] = useState(() => getOrgData());
  
  const [trustModal, setTrustModal] = useState({ isOpen: false, type: 'add', data: null });
  const [sanghModal, setSanghModal] = useState({ isOpen: false, type: 'add', data: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, type: '', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useImperativeHandle(ref, () => ({
    openTrustModal: () => setTrustModal({ isOpen: true, type: 'add', data: null }),
    openSanghModal: () => setSanghModal({ isOpen: true, type: 'add', data: null })
  }));

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSaveTrust = (formData) => {
    let newTrusts = [...data.trusts];
    if (trustModal.type === 'add') {
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
    const newData = { ...data, trusts: newTrusts };
    setData(newData);
    saveOrgData(newData);
    setTrustModal({ isOpen: false, type: 'add', data: null });
    if (onDataChange) onDataChange();
  };

  const handleSaveSangh = (formData) => {
    let newSanghs = [...data.sanghs];
    if (sanghModal.type === 'add') {
      if (newSanghs.some(s => s.name.toLowerCase() === formData.name.toLowerCase())) {
        showToast('Sangh Name Already Exists', 'error');
        return;
      }
      newSanghs.push({ ...formData, id: Date.now(), status: true });
      showToast('Sangh Added Successfully');
    } else {
      const idx = newSanghs.findIndex(s => s.id === sanghModal.data.id);
      if (idx > -1) newSanghs[idx] = { ...newSanghs[idx], ...formData };
      showToast('Sangh Updated Successfully');
    }
    const newData = { ...data, sanghs: newSanghs };
    setData(newData);
    saveOrgData(newData);
    setSanghModal({ isOpen: false, type: 'add', data: null });
    if (onDataChange) onDataChange();
  };

  const handleDelete = () => {
    let newData = { ...data };
    if (deleteConfirm.type === 'trust') {
      newData.trusts = newData.trusts.filter(t => t.id !== deleteConfirm.id);
      newData.links = newData.links.filter(l => l.trustId !== deleteConfirm.id);
    } else {
      newData.sanghs = newData.sanghs.filter(s => s.id !== deleteConfirm.id);
      newData.links = newData.links.filter(l => l.sanghId !== deleteConfirm.id);
    }
    setData(newData);
    saveOrgData(newData);
    setDeleteConfirm({ show: false, id: null, type: '' });
    showToast('Deleted Successfully', 'error');
    if (onDataChange) onDataChange();
  };

  const toggleStatus = (id, type, currentStatus) => {
    const key = type === 'trust' ? 'trusts' : 'sanghs';
    const list = [...data[key]];
    const idx = list.findIndex(i => i.id === id);
    if (idx > -1) {
      list[idx].status = !currentStatus;
      const newData = { ...data, [key]: list };
      setData(newData);
      saveOrgData(newData);
      showToast('Status Changed Successfully');
      if (onDataChange) onDataChange();
    }
  };

  // Helper function to check if a trust has a specific sangh linked
  const trustHasLinkedSangh = (trustId, sanghId) => {
    return data.links.some(l => l.trustId === trustId && l.sanghId === sanghId && l.status);
  };

  // Helper function to check if a sangh has a specific trust linked
  const sanghHasLinkedTrust = (sanghId, trustId) => {
    return data.links.some(l => l.sanghId === sanghId && l.trustId === trustId && l.status);
  };

  // Filter data
  let filteredData = [];
  if (activeTab === 'all') {
    const allItems = [
      ...data.trusts.map(t => ({ ...t, orgType: 'Trust' })),
      ...data.sanghs.map(s => ({ ...s, orgType: 'Sangh' }))
    ];
    filteredData = allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterValues.status === 'all' ? true : filterValues.status === 'active' ? item.status === true : item.status === false;
      return matchesSearch && matchesStatus;
    });
  } else if (activeTab === 'trusts') {
    filteredData = data.trusts.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterValues.status === 'all' ? true : filterValues.status === 'active' ? item.status === true : item.status === false;
      const matchesLinked = filterValues.linkedId === 'all' ? true : trustHasLinkedSangh(item.id, Number(filterValues.linkedId));
      return matchesSearch && matchesStatus && matchesLinked;
    });
  } else {
    filteredData = data.sanghs.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterValues.status === 'all' ? true : filterValues.status === 'active' ? item.status === true : item.status === false;
      const matchesLinked = filterValues.linkedId === 'all' ? true : sanghHasLinkedTrust(item.id, Number(filterValues.linkedId));
      return matchesSearch && matchesStatus && matchesLinked;
    });
  }

  useEffect(() => { setTotalEntries(filteredData.length); }, [filteredData.length]);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderHeaders = () => {
    if (activeTab === 'all') {
      return (
        <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
          <th className="w-20 px-4 py-3 text-center">Sr. No.</th>
          <th className="px-4 py-3 text-left">Organization Name</th>
          <th className="w-24 px-4 py-3 text-center">Type</th>
          <th className="w-28 px-4 py-3 text-center">Actions</th>
        </tr>
      );
    } else if (activeTab === 'trusts') {
      return (
        <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
          <th className="w-16 px-4 py-3 text-center">Sr. No.</th>
          <th className="px-4 py-3 text-left">Trust Name</th>
          <th className="w-28 px-4 py-3 text-center">City</th>
          <th className="w-28 px-4 py-3 text-center">Admin Name</th>
          <th className="w-24 px-4 py-3 text-center">Status</th>
          <th className="w-28 px-4 py-3 text-center">Actions</th>
        </tr>
      );
    } else {
      return (
        <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
          <th className="w-16 px-4 py-3 text-center">Sr. No.</th>
          <th className="px-4 py-3 text-left">Sangh Name</th>
          <th className="w-28 px-4 py-3 text-center">City</th>
          <th className="w-28 px-4 py-3 text-center">Members</th>
          <th className="w-24 px-4 py-3 text-center">Status</th>
          <th className="w-28 px-4 py-3 text-center">Actions</th>
        </tr>
      );
    }
  };

  return (
    <div className="w-full font-sans antialiased text-slate-600">
      <style>{`
        @keyframes toast-in-out {
          0% { transform: translateX(120%); opacity: 0; }
          10% { transform: translateX(0); opacity: 1; }
          90% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-150%); opacity: 0; }
        }
        .animate-toast-custom { animation: toast-in-out 3s ease-in-out forwards; }
      `}</style>

      {/* Toast - Same as Location */}
      {toast.show && (
        <div className="fixed top-8 right-8 z-[999] animate-toast-custom">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === 'error' ? 'bg-rose-500 border-rose-400' : 'bg-emerald-500 border-emerald-400'} text-white`}>
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

      {/* Main Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>{renderHeaders()}</thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => {
                const serialNo = (currentPage - 1) * itemsPerPage + idx + 1;
                
                if (activeTab === 'all') {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group" onClick={() => setDetailsModal({ isOpen: true, type: item.orgType === 'Trust' ? 'trust' : 'sangh', data: item })}>
                      <td className="px-4 py-3 text-center text-sm font-medium text-slate-500">{serialNo}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${item.orgType === 'Trust' ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                          {item.orgType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => setDetailsModal({ isOpen: true, type: item.orgType === 'Trust' ? 'trust' : 'sangh', data: item })} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } else if (activeTab === 'trusts') {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 text-center text-sm font-medium text-slate-500">{serialNo}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600">{item.city}</td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600">{item.admin}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <StatusToggle status={item.status} onToggle={() => toggleStatus(item.id, 'trust', item.status)} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setDetailsModal({ isOpen: true, type: 'trust', data: item })} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => setTrustModal({ isOpen: true, type: 'edit', data: item })} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ show: true, id: item.id, type: 'trust' })} className="text-slate-400 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-lg">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 text-center text-sm font-medium text-slate-500">{serialNo}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600">{item.city}</td>
                      <td className="px-4 py-3 text-center text-sm text-slate-600">{item.members?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <StatusToggle status={item.status} onToggle={() => toggleStatus(item.id, 'sangh', item.status)} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setDetailsModal({ isOpen: true, type: 'sangh', data: item })} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => setSanghModal({ isOpen: true, type: 'edit', data: item })} className="text-slate-400 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-lg">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteConfirm({ show: true, id: item.id, type: 'sangh' })} className="text-slate-400 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-lg">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              })
            ) : (
              <tr>
                <td colSpan={activeTab === 'all' ? 4 : 6} className="py-8 text-center text-sm text-slate-400">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Trust Form Modal */}
      {trustModal.isOpen && (
        <TrustFormModal 
          isOpen={trustModal.isOpen} 
          onClose={() => setTrustModal({ isOpen: false, type: 'add', data: null })} 
          initialData={trustModal.data} 
          onSave={handleSaveTrust} 
        />
      )}

      {/* Sangh Form Modal */}
      {sanghModal.isOpen && (
        <SanghFormModal 
          isOpen={sanghModal.isOpen} 
          onClose={() => setSanghModal({ isOpen: false, type: 'add', data: null })} 
          initialData={sanghModal.data} 
          onSave={handleSaveSangh} 
        />
      )}

      {/* Details Modals */}
      {detailsModal.isOpen && detailsModal.type === 'trust' && (
        <TrustDetailsModal 
          isOpen={detailsModal.isOpen} 
          onClose={() => setDetailsModal({ isOpen: false, type: '', data: null })} 
          trust={detailsModal.data} 
          allData={data} 
        />
      )}
      
      {detailsModal.isOpen && detailsModal.type === 'sangh' && (
        <SanghDetailsModal 
          isOpen={detailsModal.isOpen} 
          onClose={() => setDetailsModal({ isOpen: false, type: '', data: null })} 
          sangh={detailsModal.data} 
          allData={data} 
        />
      )}

      {/* Delete Confirmation - Same as Location */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[280px] rounded-2xl p-5 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={22} />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">Confirm Delete?</h3>
            <p className="text-[11px] text-slate-400 mt-1">This action cannot be undone</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setDeleteConfirm({ show: false, id: null, type: '' })} className="flex-1 py-2 text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-xs font-semibold text-white bg-rose-500 rounded-xl shadow-md hover:bg-rose-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default OrgTable;