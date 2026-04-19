import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Edit2, Trash2, Eye, X, Check, AlertTriangle, ArrowLeft, ChevronDown } from 'lucide-react';
import StatusToggle from '../../components/common/StatusToggle';
import { useToast } from '../../components/common/Toast';

const generateInitialData = () => {
  return {
    Country: [
      { id: 1, name: 'India', code: 'IND', status: true },
      { id: 2, name: 'USA', code: 'USA', status: true },
      { id: 3, name: 'UK', code: 'UK', status: true }
    ],
    State: [
      { id: 101, countryId: 1, name: 'Gujarat', code: 'GJ', status: true },
      { id: 102, countryId: 1, name: 'Maharashtra', code: 'MH', status: true },
      { id: 103, countryId: 2, name: 'California', code: 'CA', status: true }
    ],
    City: [
      { id: 201, stateId: 101, name: 'Ahmedabad', code: 'AMD', status: true },
      { id: 202, stateId: 101, name: 'Surat', code: 'SRT', status: true }
    ],
    Area: [
      { id: 301, cityId: 201, name: 'SG Highway', code: 'SGH', status: true },
      { id: 302, cityId: 201, name: 'Maninagar', code: 'MNR', status: true }
    ],
    Pincode: [
      { id: 401, areaId: 301, name: '380015', code: '380015', status: true }
    ]
  };
};

const LocationTable = forwardRef(({ activeTab, searchTerm, filterValues, itemsPerPage, currentPage, setCurrentPage, setTotalEntries, onDataChange }, ref) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('location_v_final_production');
    if (saved) return JSON.parse(saved);
    return generateInitialData();
  });

  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const showToast = useToast();

  const getDefaultFormData = () => {
    const firstCountry = data.Country[0]?.id || 1;
    const firstState = data.State[0]?.id || 101;
    const firstCity = data.City[0]?.id || 201;
    const firstArea = data.Area[0]?.id || 301;

    return {
      status: true,
      name: '',
      code: '',
      countryId: firstCountry,
      stateId: firstState,
      cityId: firstCity,
      areaId: firstArea
    };
  };

  const [formData, setFormData] = useState(getDefaultFormData());

  const getParentName = (item) => {
    if (activeTab === 'State') {
      const parent = data.Country.find(c => c.id === item.countryId);
      return parent ? parent.name : '---';
    }
    if (activeTab === 'City') {
      const parent = data.State.find(s => s.id === item.stateId);
      return parent ? parent.name : '---';
    }
    if (activeTab === 'Area') {
      const parent = data.City.find(c => c.id === item.cityId);
      return parent ? parent.name : '---';
    }
    if (activeTab === 'Pincode') {
      const parent = data.Area.find(a => a.id === item.areaId);
      return parent ? parent.name : '---';
    }
    return '-';
  };

  useEffect(() => {
    localStorage.setItem('location_v_final_production', JSON.stringify(data));
    if (onDataChange) onDataChange({
      Country: data.Country.length, State: data.State.length, City: data.City.length, Area: data.Area.length, Pincode: data.Pincode.length
    });
  }, [data]);

  useImperativeHandle(ref, () => ({
    openAddModal: () => {
      setFormData(getDefaultFormData());
      setModal({ isOpen: true, type: 'add', data: null });
    },
    getFilterOptions: (type) => {
      return data[type] || [];
    }
  }));



  const updateStatus = (id, currentStatus) => {
    const nextStatus = !currentStatus;
    const updated = data[activeTab].map(i => i.id === id ? { ...i, status: nextStatus } : i);
    setData({ ...data, [activeTab]: updated });
    
    showToast(
      `${activeTab} status set to ${nextStatus ? 'Active' : 'Inactive'} successfully!`,
      "success"
    );

    if (modal.isOpen && modal.data?.id === id) {
      setModal(prev => ({ ...prev, data: { ...prev.data, status: nextStatus } }));
    }
  };

  const handleSave = () => {
    if (modal.type === 'add') {
      const newEntry = { ...formData, id: Date.now() };
      setData(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newEntry] }));
      showToast(`${activeTab} added successfully!`, "success");
    } else {
      const updatePayload = { ...formData, id: modal.data.id };
      setData(prev => ({ ...prev, [activeTab]: prev[activeTab].map(i => i.id === modal.data.id ? updatePayload : i) }));
      showToast(`${activeTab} updated successfully!`, "success");
    }
    setModal({ isOpen: false });
  };

  const filteredData = data[activeTab]?.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.code || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterValues.status === 'all' ? true :
                          filterValues.status === 'active' ? item.status === true :
                          item.status === false;

    let matchesParent = true;
    if (activeTab === 'State' && filterValues.countryId !== 'all') {
      matchesParent = item.countryId === Number(filterValues.countryId);
    } else if (activeTab === 'City' && filterValues.stateId !== 'all') {
      matchesParent = item.stateId === Number(filterValues.stateId);
    } else if (activeTab === 'Area' && filterValues.cityId !== 'all') {
      matchesParent = item.cityId === Number(filterValues.cityId);
    } else if (activeTab === 'Pincode') {
      const matchesArea = filterValues.areaId === 'all' || item.areaId === Number(filterValues.areaId);
      const matchesPin = filterValues.pincodeNumber === '' || String(item.code).includes(filterValues.pincodeNumber);
      matchesParent = matchesArea && matchesPin;
    }

    return matchesSearch && matchesStatus && matchesParent;
  }) || [];

  useEffect(() => { setTotalEntries(filteredData.length); }, [filteredData.length]);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getParentIdKey = () => {
    if (activeTab === 'State') return 'countryId';
    if (activeTab === 'City') return 'stateId';
    if (activeTab === 'Area') return 'cityId';
    if (activeTab === 'Pincode') return 'areaId';
    return 'parentId';
  };

  const getParentLabel = () => {
    if (activeTab === 'State') return 'Country';
    if (activeTab === 'City') return 'State';
    if (activeTab === 'Area') return 'City';
    if (activeTab === 'Pincode') return 'Area';
    return 'Region';
  };

  const getParentOptions = () => {
    if (activeTab === 'State') return data.Country;
    if (activeTab === 'City') return data.State;
    if (activeTab === 'Area') return data.City;
    if (activeTab === 'Pincode') return data.Area;
    return [];
  };

  return (
    <div className="w-full font-sans antialiased text-slate-600">
      <style>{`
       .custom-select { appearance: none; -webkit-appearance: none; }
      `}</style>

      {/* Main Table - Balanced Widths for Equal Gaps */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
       <table className="w-full table-fixed border-collapse">
  <thead>
    <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
      <th className="w-1/4 px-6 py-2 text-center">
        Sr. No.
      </th>

      <th className="w-1/4 px-6 py-2 text-center">
        {activeTab === 'Pincode' ? 'Pincode Number' : `${activeTab} Name`}
      </th>

      <th className="w-1/4 px-6 py-2 text-center">
        Status
      </th>

      <th className="w-1/4 px-6 py-2 text-center">
        Actions
      </th>
    </tr>
  </thead>

  <tbody className="divide-y divide-slate-100">
    {paginatedData.length > 0 ? (
      paginatedData.map((row, idx) => (
        <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
          <td className="w-1/4 px-6 py-2 text-center text-sm font-medium text-slate-500 align-middle">
            {(currentPage - 1) * itemsPerPage + idx + 1}
          </td>

          <td className="w-1/4 px-6 py-2 text-center text-sm font-medium text-slate-500 align-middle">
            {row.name || row.code}
          </td>

          <td className="w-1/4 px-6 py-2 text-center align-middle">
            <div className="flex items-center justify-center">
              <StatusToggle
                status={row.status}
                onToggle={() => updateStatus(row.id, row.status)}
              />
            </div>
          </td>

          <td className="w-1/4 px-6 py-2 text-center align-middle">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  setModal({
                    isOpen: true,
                    type: 'view',
                    data: row
                  })
                }
                className="text-slate-400 hover:text-emerald-600 transition-all p-1 hover:bg-emerald-50 rounded-full"
              >
                <Eye size={15} />
              </button>

              <button
                onClick={() => {
                  const pId = getParentIdKey();

                  setFormData({
                    ...row,
                    [pId]: row[pId] || getDefaultFormData()[pId]
                  });

                  setModal({
                    isOpen: true,
                    type: 'edit',
                    data: row
                  });
                }}
                className="text-slate-400 hover:text-emerald-600 transition-all p-1 hover:bg-emerald-50 rounded-full"
              >
                <Edit2 size={15} />
              </button>

              <button
                onClick={() =>
                  setDeleteConfirm({
                    show: true,
                    id: row.id
                  })
                }
                className="text-slate-400 hover:text-rose-500 transition-all p-1 hover:bg-rose-50 rounded-full"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan="4"
          className="py-6 text-center text-sm text-slate-400"
        >
          No matching records found
        </td>
      </tr>
    )}
  </tbody>
</table>
      </div>

      {/* Modal - Normal Fonts, Clean Parent Card */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="px-8 pt-6 pb-0 shrink-0">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setModal({isOpen: false})} className="p-1.5 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft size={18} className="text-slate-600" /></button>
                  <h3 className="font-medium text-slate-800 text-lg tracking-tight">{modal.type === 'add' ? 'Add' : modal.type === 'view' ? 'View' : 'Edit'} {activeTab} Details</h3>
                </div>
                <button onClick={() => setModal({isOpen: false})} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="w-full h-[1px] bg-slate-100 mb-6"></div>
            </div>
            <div className="px-8 pb-8 pt-2 overflow-y-auto">
              {modal.type === 'view' ? (
                <div className="space-y-4">
                  <div className="flex gap-2 mb-1 flex-wrap">
                    {activeTab !== 'Pincode' && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium border border-emerald-100 uppercase">{modal.data?.name}</span>}
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-medium border border-slate-100 uppercase">{modal.data?.code}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-medium border uppercase ${modal.data?.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>{modal.data?.status ? 'Active' : 'Inactive'}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {activeTab !== 'Country' && (
                      <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                        <p className="text-xs font-medium text-slate-400 uppercase mb-1">{getParentLabel()}</p>
                        <p className="font-medium text-slate-800 text-sm">{getParentName(modal.data)}</p>
                      </div>
                    )}

                    <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <p className="text-xs font-medium text-slate-400 uppercase mb-1">
                        {activeTab === 'Pincode' ? 'Pincode Number' : `${activeTab} Name`}
                      </p>
                      <p className="font-medium text-slate-800 text-sm">{modal.data?.name || '---'}</p>
                    </div>

                    <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <p className="text-xs font-medium text-slate-400 uppercase mb-1">{activeTab} Code</p>
                      <p className="font-medium text-slate-800 text-sm">{modal.data?.code || '---'}</p>
                    </div>

                    <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <p className="text-xs font-medium text-slate-400 uppercase mb-1">Status</p>
                      <p className={`font-medium text-sm ${modal.data?.status ? 'text-emerald-600' : 'text-rose-500'}`}>{modal.data?.status ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 border border-slate-100 rounded-2xl bg-slate-50 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Quick Status Toggle</p>
                      <StatusToggle status={modal.data?.status} onToggle={() => updateStatus(modal.data.id, modal.data.status)} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTab !== 'Country' && (
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-medium text-slate-700 ml-1">{getParentLabel()} <span className="text-rose-500">*</span></label>
                      <div className="relative group">
                        <select className="custom-select w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700 cursor-pointer" value={formData[getParentIdKey()]} onChange={(e) => setFormData({...formData, [getParentIdKey()]: Number(e.target.value)})}>
                          {getParentOptions().map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-emerald-500 transition-colors" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 ml-1">
                      {activeTab === 'Pincode' ? 'Pincode Number' : `${activeTab} Name`} <span className="text-rose-500">*</span>
                    </label>
                    <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-slate-700" placeholder={`Enter ${activeTab === 'Pincode' ? 'Pincode Number' : activeTab + ' Name'}`} value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-slate-700 ml-1">{activeTab} Code <span className="text-rose-500">*</span></label><input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all uppercase text-slate-700" placeholder={`Enter ${activeTab} Code`} value={formData.code || ''} onChange={(e) => setFormData({...formData, code: e.target.value})} /></div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700 ml-1">Status</label>
                    <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl focus-within:border-emerald-500 transition-colors"><span className="text-sm font-medium text-slate-700">{formData.status ? 'Active' : 'Inactive'}</span><StatusToggle status={formData.status} onToggle={() => setFormData({...formData, status: !formData.status})} /></div>
                  </div>
                  <div className="flex gap-3 pt-2"><button onClick={() => setModal({isOpen: false})} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-all">Cancel</button><button onClick={handleSave} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">{modal.type === 'add' ? 'Add Now' : 'Save Changes'}</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[280px] rounded-[24px] p-6 text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={24} /></div>
            <h3 className="font-medium text-slate-800 text-sm">Confirm Delete?</h3>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setDeleteConfirm({ show: false, id: null })} className="flex-1 py-2 text-xs font-medium text-slate-400 bg-slate-50 rounded-xl">No</button>
              <button onClick={() => { setData({...data, [activeTab]: data[activeTab].filter(i => i.id !== deleteConfirm.id)}); setDeleteConfirm({ show: false, id: null }); showToast(`${activeTab} deleted successfully!`, "delete"); }} className="flex-1 py-2 text-xs font-medium text-white bg-rose-500 rounded-xl shadow-lg">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default LocationTable;