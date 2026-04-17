import React, { useState, useEffect, useMemo } from 'react';
import {
  Gem, Plus, Eye, Pencil, Trash2, MapPin, Users, CalendarDays,
  Search, Phone, Mail, Clock, Building2, ChevronRight, Image as ImageIcon,
  ArrowLeft, X, Check
} from 'lucide-react';
import CommonPageLayout from '../../../components/common/CommonPageLayout';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import StatusToggle from '../../../components/common/StatusToggle';
import { useToast } from '../../../components/common/Toast';
import Modal from '../../../components/common/Modal';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { derasarService } from '../../../services/derasarService';
import FilterButton from '../../../components/common/FilterButton';
import Input from '../../../components/common/Input';
import Pagination from '../../../components/common/Pagination';
import CustomDropdown from '../../../components/common/CustomDropdown';
import TimePicker from '../../../components/common/TimePicker';

// ── Tab config ──────────────────────────────────────────────────────────────
const TABS = ['Derasar Details', 'Location', 'Contact & Management'];

// ── Dropdown Options ────────────────────────────────────────────────────────
const DERASAR_TYPES = ['Shwetambar', 'Digambar', 'Sthanakvasi', 'Terapanthi'];
const PRATIMA_TYPES = [
  { label: 'Marble (આરસ)', value: 'Marble (આરસ)' },
  { label: 'Panchdhatu', value: 'Panchdhatu' },
  { label: 'Ashtadhatu', value: 'Ashtadhatu' },
  { label: 'Stone (પથ્થર)', value: 'Stone (પથ્થર)' }
];
const STATUS_OPTIONS = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];
const GUJARAT_DISTRICTS = ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Junagadh','Patan','Mehsana','Gandhinagar','Anand','Kheda','Nadiad','Surendranagar','Amreli','Porbandar','Jamnagar','Kutch','Banaskantha','Sabarkantha','Other'];

// ── Empty form ───────────────────────────────────────────────────────────────
const emptyForm = {
  name: '',
  type: '',
  moolNayak: '',
  pratimaType: '',
  established: '',
  pratimas: '',
  poojaris: '',
  morningFrom: '06:00',
  morningTo: '12:00',
  eveningFrom: '16:00',
  eveningTo: '20:00',
  dharamshala: false,
  bhojanshala: false,
  parking: false,
  upashray: false,
  disabled: false,
  photo: null,
  status: 'Active',
  registrationNumber: '',
  address: '',
  landmark: '',
  city: '',
  taluka: '',
  district: '',
  pincode: '',
  mapLink: '',
  trusteeName: '',
  trusteePhone: '',
  pujariName: '',
  pujariPhone: '',
  trustName: '',
  email: '',
};

export default function Derasar() {
  const [derasars, setDerasars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const showToast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await derasarService.getDerasars();
      setDerasars(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching derasars:', error);
      showToast('Failed to load derasar data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => derasars.filter(item => {
    const q = search.toLowerCase();
    return (!search || item.name?.toLowerCase().includes(q) || item.city?.toLowerCase().includes(q) || item.moolNayak?.toLowerCase().includes(q)) && (filters.status === 'All' || item.status === filters.status);
  }), [derasars, search, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(start, start + recordsPerPage);
  }, [filteredData, currentPage, recordsPerPage]);

  const stats = useMemo(() => [
    { title: 'TOTAL DERASAR', value: derasars.length, icon: Gem, color: 'sky' },
    { title: 'ACTIVE DERASAR', value: derasars.filter(d => d.status === 'Active').length, icon: Gem, color: 'teal' },
    { title: 'INACTIVE DERASAR', value: derasars.filter(d => d.status === 'Inactive').length, icon: Gem, color: 'rose' },
  ], [derasars]);

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setFormData(item ? { ...emptyForm, ...item } : emptyForm);
    setActiveTab(0);
    setIsModalOpen(true);
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const toggleStatus = async (item) => {
    try {
      const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
      await derasarService.updateDerasar(item.id, { ...item, status: newStatus });
      fetchData();
      showToast(`Derasar set to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Failed to update status', 'error');
    }
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'add') {
        await derasarService.createDerasar(formData);
        showToast('Derasar added successfully');
      } else {
        await derasarService.updateDerasar(currentItem.id, formData);
        showToast('Derasar updated successfully');
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving derasar:', error);
      showToast('Action failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await derasarService.deleteDerasar(itemToDelete.id);
      showToast('Derasar deleted successfully', 'delete');
      fetchData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting derasar:', error);
      showToast('Delete failed', 'error');
    }
  };

  const isView = modalMode === 'view';

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <Tab1 formData={formData} set={set} isView={isView} />;
      case 1: return <Tab2 formData={formData} set={set} isView={isView} />;
      case 2: return <Tab3 formData={formData} set={set} isView={isView} />;
      default: return null;
    }
  };

  const columns = [
    { key: 'id', label: 'SR. NO', align: 'center', render: (_, __, i) => i + 1 },
    { key: 'name', label: 'DERASAR NAME', sortable: true, render: (v, r) => (
      <div className="flex flex-col">
        <span className="font-bold text-teal-600">{v}</span>
        <span className="text-xs text-slate-400">{r.type || ''}</span>
      </div>
    )},
    { key: 'moolNayak', label: 'MOOL NAYAK', render: v => <span className="text-slate-600 font-medium text-sm">{v || '—'}</span> },
    { key: 'city', label: 'CITY / DISTRICT', render: (v, r) => (
      <div className="flex flex-col">
        <span className="text-slate-600 font-medium text-sm">{v}</span>
        <span className="text-xs text-slate-400">{r.district || ''}</span>
      </div>
    )},
    { key: 'pratimas', label: 'PRATIMAS', align: 'center' },
    { key: 'poojaris', label: 'POOJARIS', align: 'center' },
    { key: 'status', label: 'STATUS', align: 'center', render: (v, r) => <StatusToggle status={v === 'Active'} onToggle={() => toggleStatus(r)} /> },
    { key: 'actions', label: 'ACTION', align: 'center', render: (_, r) => (
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => openModal('view', r)} className="w-8 h-8 flex items-center justify-center text-teal-500 bg-teal-50 hover:bg-teal-100 rounded-full transition-all"><Eye size={15} /></button>
        <button onClick={() => openModal('edit', r)} className="w-8 h-8 flex items-center justify-center text-sky-500 bg-sky-50 hover:bg-sky-100 rounded-full transition-all border border-sky-100"><Pencil size={15} /></button>
        <button onClick={() => { setItemToDelete(r); setIsDeleteModalOpen(true); }} className="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-full transition-all border border-rose-100"><Trash2 size={15} /></button>
      </div>
    )}
  ];

  const modalHeader = (
    <div className="flex items-center gap-3">
      <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
        <ArrowLeft size={18} />
      </button>
      <h2 className="text-[17px] font-bold text-slate-800">
        {modalMode === 'add' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} Derasar
      </h2>
    </div>
  );

  const modalFooter = (
    <div className="flex items-center gap-3">
      {!isView ? (
        <>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-36 h-[42px] rounded-xl border border-slate-200 text-slate-500 font-bold text-[14px] hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95"
          >
            Cancel
          </button>
          {activeTab < TABS.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveTab(t => t + 1)}
              className="w-36 h-[42px] rounded-xl bg-teal-600 text-white font-bold text-[14px] hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-100 transition-all active:scale-95"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="w-36 h-[42px] rounded-xl bg-teal-600 text-white font-bold text-[14px] hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-100 transition-all active:scale-95"
            >
              {modalMode === 'add' ? 'Submit' : 'Update'}
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="w-36 h-[42px] rounded-xl border border-slate-200 text-slate-500 font-bold text-[14px] hover:bg-slate-50 transition-all"
        >
          Close
        </button>
      )}
    </div>
  );

  return (
    <CommonPageLayout title="Derasar Management" stats={stats}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full h-[40px] pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] focus:ring-2 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all font-medium" />
          </div>
          <div className="flex items-center gap-2">
            <FilterButton filters={filters} options={[{ key: 'status', placeholder: 'Status', items: [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }] }]} onChange={(k, v) => { setFilters(p => ({ ...p, [k]: v })); setCurrentPage(1); }} onClear={() => { setFilters({ status: 'All' }); setCurrentPage(1); }} dataCount={filteredData.length} />
            <Button icon={Plus} onClick={() => openModal('add')} className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 text-[13px] h-[40px] px-4">Add Derasar</Button>
          </div>
        </div>
        <Table columns={columns} data={paginatedData} loading={loading} />
        <Pagination currentPage={currentPage} totalRecords={filteredData.length} recordsPerPage={recordsPerPage} onPageChange={setCurrentPage} onRecordsPerPageChange={v => { setRecordsPerPage(v); setCurrentPage(1); }} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xxl"
        title={modalHeader}
        footer={modalFooter}
      >
        <div className="flex flex-col h-full">
          {/* Tabs - Sticky at the top of the body area */}
          <div className="sticky -top-5 z-20 bg-white/95 backdrop-blur-sm -mx-5 px-5 pt-1 pb-4 mb-2 border-b border-slate-100/50">
            <div className="flex gap-2 p-1 bg-slate-100/60 rounded-xl w-fit">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`px-5 py-2 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === i ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-2">
            {renderTab()}
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Derasar" message={`Delete "${itemToDelete?.name}"?`} confirmLabel="Delete" variant="danger" />
    </CommonPageLayout>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components for Tabs
// ─────────────────────────────────────────────────────────────────────────────

function Tab1({ formData, set, isView }) {
  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <div className="flex-shrink-0">
        <label className={`relative group w-[340px] h-[220px] rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer bg-white hover:bg-teal-50 hover:border-teal-300 transition-all ${isView ? 'pointer-events-none' : ''}`}>
          {formData.photo ? (
            <div className="w-full h-full p-2 relative">
              <img src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)} alt="preview" className="w-full h-full object-cover rounded-[18px]" />
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600"><ImageIcon size={24} /></div>
              <div className="text-center"><p className="text-[14px] font-bold text-slate-700">Browse Image</p><p className="text-[11px] text-slate-400 mt-0.5 font-medium">JPG, PNG supported</p></div>
            </>
          )}
          {!isView && <input type="file" accept="image/*" className="hidden" onChange={e => set('photo', e.target.files[0])} />}
        </label>
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Derasar Name" placeholder="Enter Name" value={formData.name} onChange={e => set('name', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Derasar Type *</label>
          <CustomDropdown
            value={formData.type}
            onChange={v => set('type', v)}
            items={DERASAR_TYPES}
            placeholder="Select Type"
            disabled={isView}
          />
        </div>
        <Input label="Mool Nayak (મૂળ નાયક)" placeholder="Enter Name" value={formData.moolNayak} onChange={e => set('moolNayak', e.target.value)} required disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Pratima Type</label>
          <CustomDropdown
            value={formData.pratimaType}
            onChange={v => set('pratimaType', v)}
            items={PRATIMA_TYPES}
            placeholder="Select Material"
            disabled={isView}
          />
        </div>
        <Input label="Established Year" placeholder="Enter Year" value={formData.established} onChange={e => set('established', e.target.value)} disabled={isView} />
        <Input label="No. of Pratimas" type="number" placeholder="Count" value={formData.pratimas} onChange={e => set('pratimas', e.target.value)} required disabled={isView} />
        <Input label="No. of Poojaris" type="number" placeholder="Count" value={formData.poojaris} onChange={e => set('poojaris', e.target.value)} required disabled={isView} />
        <Input label="Registration Number" placeholder="Number" value={formData.registrationNumber} onChange={e => set('registrationNumber', e.target.value)} disabled={isView} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-600">Status *</label>
          <CustomDropdown
            value={formData.status}
            onChange={v => set('status', v)}
            items={STATUS_OPTIONS}
            placeholder="Select Status"
            disabled={isView}
          />
        </div>
      </div>
    </div>
  );
}

function Tab2({ formData, set, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div className="md:col-span-2"><Input label="Address" placeholder="Address" value={formData.address} onChange={e => set('address', e.target.value)} required disabled={isView} /></div>
      <Input label="Landmark" placeholder="Landmark" value={formData.landmark} onChange={e => set('landmark', e.target.value)} disabled={isView} />
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-slate-600">District *</label>
        <CustomDropdown
          value={formData.district}
          onChange={v => set('district', v)}
          items={GUJARAT_DISTRICTS}
          placeholder="Select District"
          disabled={isView}
        />
      </div>
      <Input label="City / Village" placeholder="City" value={formData.city} onChange={e => set('city', e.target.value)} required disabled={isView} icon={Building2} />
      <Input label="Taluka / Area" placeholder="Area" value={formData.taluka} onChange={e => set('taluka', e.target.value)} disabled={isView} icon={Building2} />
      <Input label="Pincode" placeholder="6 Digits" value={formData.pincode} onChange={e => set('pincode', e.target.value)} required disabled={isView} maxLength={6} />
      <Input label="Google Maps Link" placeholder="Link" value={formData.mapLink} onChange={e => set('mapLink', e.target.value)} disabled={isView} icon={MapPin} />
    </div>
  );
}

function Tab3({ formData, set, isView }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input label="Trustee Name" placeholder="Trustee Name" value={formData.trusteeName} onChange={e => set('trusteeName', e.target.value)} required disabled={isView} icon={Users} />
        <Input label="Trustee Phone" placeholder="Phone" type="tel" value={formData.trusteePhone} onChange={e => set('trusteePhone', e.target.value)} required disabled={isView} icon={Phone} />
        <Input label="Pujari Name" placeholder="Pujari Name" value={formData.pujariName} onChange={e => set('pujariName', e.target.value)} disabled={isView} icon={Users} />
        <Input label="Pujari Phone" placeholder="Phone" type="tel" value={formData.pujariPhone} onChange={e => set('pujariPhone', e.target.value)} disabled={isView} icon={Phone} />
        <Input label="Trust Name" placeholder="Trust Name" value={formData.trustName} onChange={e => set('trustName', e.target.value)} disabled={isView} icon={Building2} />
        <Input label="Email" placeholder="Email" type="email" value={formData.email} onChange={e => set('email', e.target.value)} disabled={isView} icon={Mail} />
      </div>
      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h4 className="flex items-center gap-2 text-slate-800 font-bold text-[14px] mb-6">
          <Clock size={16} className="text-teal-600" />
          Temple Timings
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="block text-[13px] font-bold text-slate-600 mb-3">Morning Session</label>
            <div className="flex items-center gap-3">
              <TimePicker 
                value={formData.morningFrom} 
                onChange={e => set('morningFrom', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
              <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-1">to</span>
              <TimePicker 
                value={formData.morningTo} 
                onChange={e => set('morningTo', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-600 mb-3">Evening Session</label>
            <div className="flex items-center gap-3">
              <TimePicker 
                value={formData.eveningFrom} 
                onChange={e => set('eveningFrom', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
              <span className="text-slate-400 text-[11px] font-black uppercase tracking-widest px-1">to</span>
              <TimePicker 
                value={formData.eveningTo} 
                onChange={e => set('eveningTo', e.target.value)} 
                disabled={isView} 
                className="flex-1" 
              />
            </div>
          </div>
        </div>
      </div>
      <div><h4 className="text-slate-800 font-bold text-[14px] mb-4">Facilities</h4><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {['dharamshala','bhojanshala','parking','upashray','disabled'].map(k => (
          <label key={k} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 select-none ${formData[k] ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-slate-200 bg-white text-slate-500 hover:border-teal-300'} ${isView ? 'pointer-events-none' : 'active:scale-95'}`}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${formData[k] ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white'}`}>
              {formData[k] && <Check size={14} className="text-white stroke-[3px]" />}
            </div>
            <input type="checkbox" checked={!!formData[k]} onChange={e => set(k, e.target.checked)} disabled={isView} className="hidden" />
            <span className="text-[13px] font-bold capitalize">{k}</span>
          </label>
        ))}
      </div></div>
    </div>
  );
}