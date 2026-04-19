import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Users, UserCheck, UserX, Trash2, Plus, Search, SlidersHorizontal, Eye, Edit2, AlertTriangle, X, ArrowLeft, ChevronDown } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import UserForm from '../../components/users/UserForm';
import { useToast } from '../../components/common/Toast';
import CustomDropdown from '../../components/common/CustomDropdown';
import StatusBadge from '../../components/common/StatusBadge';

import { INITIAL_USERS, INITIAL_USER_DOCS, INITIAL_ACTIVITIES, getStatusCounts } from './userData';
import { INITIAL_ROLES, PERM_GROUPS } from '../RolesAndPermissions/RoleData';
import { INITIAL_TRUSTS, INITIAL_SANGHS, INITIAL_DEPARTMENTS } from '../organization/orgData';

const DEFAULT_FILTERS = { status: '', trustId: '', sanghId: '', departmentId: '', roleId: '', approvalStatus: '' };

function Toggle({ active, onToggle }) {
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 focus:outline-none ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function UserList() {
  const showToast = useToast();
  const filterRef = useRef(null);

  const [users, setUsers] = useState(() => {
    const s = localStorage.getItem('users_master');
    return s ? JSON.parse(s) : INITIAL_USERS;
  });
  const [docs, setDocs] = useState(() => {
    const s = localStorage.getItem('user_docs_master');
    return s ? JSON.parse(s) : INITIAL_USER_DOCS;
  });
  const [activities, setActivities] = useState(() => {
    const s = localStorage.getItem('user_activities_master');
    return s ? JSON.parse(s) : INITIAL_ACTIVITIES;
  });

  useEffect(() => localStorage.setItem('users_master', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('user_docs_master', JSON.stringify(docs)), [docs]);
  useEffect(() => localStorage.setItem('user_activities_master', JSON.stringify(activities)), [activities]);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [viewUser, setViewUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setIsFilterOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const enriched = useMemo(() => users.map(u => ({
    ...u,
    roleName:       INITIAL_ROLES.find(r => r.id === u.roleId)?.name || '—',
    trustName:      INITIAL_TRUSTS.find(t => t.id === u.trustId)?.name || '—',
    sanghName:      INITIAL_SANGHS.find(s => s.id === u.sanghId)?.name || '—',
    deptName:       INITIAL_DEPARTMENTS.find(d => d.id === u.departmentId)?.name || '—',
    approvalStatus: u.approvalStatus || 'Approved',
  })), [users]);

  const filtered = useMemo(() => enriched.filter(u => {
    const q = search.toLowerCase();
    return (
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q)) &&
      (!filters.status         || u.status === filters.status) &&
      (!filters.trustId        || Number(u.trustId) === Number(filters.trustId)) &&
      (!filters.sanghId        || Number(u.sanghId) === Number(filters.sanghId)) &&
      (!filters.departmentId   || Number(u.departmentId) === Number(filters.departmentId)) &&
      (!filters.roleId         || Number(u.roleId) === Number(filters.roleId)) &&
      (!filters.approvalStatus || u.approvalStatus === filters.approvalStatus)
    );
  }), [enriched, search, filters]);

  const stats = useMemo(() => {
    const c = getStatusCounts(users);
    return [
      { title: 'Total Users', value: c.Total,    icon: Users,     color: 'teal' },
      { title: 'Active',      value: c.Active,   icon: UserCheck, color: 'emerald' },
      { title: 'Inactive',    value: c.Inactive, icon: UserX,     color: 'sky' },
    ];
  }, [users]);

  const paginated = useMemo(() => {
    const s = (currentPage - 1) * itemsPerPage;
    return filtered.slice(s, s + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  const handleToggleStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    const next = user.status === 'Active' ? 'Inactive' : 'Active';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: next } : u));
    if (viewUser?.id === userId) setViewUser(prev => ({ ...prev, status: next }));
    showToast(`User status updated to ${next} successfully.`);
    setActivities(prev => [{ id: Date.now(), userId, action: 'status_change', doneBy: 'Admin', description: `Status changed to ${next}`, date: new Date().toISOString().slice(0, 16).replace('T', ' ') }, ...prev]);
  };

  const handleSaveUser = (formData) => {
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers(prev => [...prev, { ...formData, id: newId, joined: new Date().toISOString().split('T')[0] }]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast('User deleted successfully.');
  };

  const filterOptions = [
    { key: 'status',         label: 'Status',          items: [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }] },
    { key: 'roleId',         label: 'Role',            items: INITIAL_ROLES.map(r => ({ value: r.id, label: r.name })) },
  ];

  return (
    <div className="-mx-5 lg:-mx-7 -mt-8 lg:-mt-10 bg-slate-50/40 min-h-screen font-sans pb-10">
      <div className="px-5 lg:px-7 pt-8 pb-4 space-y-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
          User Management
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => <StatCard key={s.title} {...s} />)}
        </div>
      </div>

      <div className="px-5 lg:px-7 mt-2">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end" ref={filterRef}>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(v => !v)}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-bold shadow-sm transition-all ${isFilterOpen || hasActiveFilters ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600'}`}
                >
                  <SlidersHorizontal size={16} strokeWidth={2.5} className="text-emerald-600" />
                  Filter
                  {hasActiveFilters && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {Object.values(filters).filter(v => v !== '').length}
                    </span>
                  )}
                </button>

                  {isFilterOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] p-5 font-sans">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <h3 className="text-[13px] font-bold text-slate-700">Filter By</h3>
                      {hasActiveFilters && (
                        <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); setCurrentPage(1); }} className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700">Clear All</button>
                      )}
                    </div>
                    <div className="space-y-4">

                      {/* Status — radio like Location */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                        <div className="flex items-center gap-4">
                          {[{ val: '', label: 'All' }, { val: 'Active', label: 'Active' }, { val: 'Inactive', label: 'Inactive' }].map(({ val, label }) => (
                            <label key={label} className="flex items-center gap-2 cursor-pointer group">
                              <input type="radio" name="filter_status" className="hidden" checked={filters.status === val} onChange={() => { setFilters(prev => ({ ...prev, status: val })); setCurrentPage(1); }} />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${filters.status === val ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.status === val && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                              </div>
                              <span className={`text-xs font-bold ${filters.status === val ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Other filters — dropdown, instant apply */}
                      {filterOptions.filter(o => o.key !== 'status').map(opt => (
                        <div key={opt.key} className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{opt.label}</label>
                          <div className="relative">
                            <select
                              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-500 transition-all"
                              value={filters[opt.key] || ''}
                              onChange={(e) => { setFilters(prev => ({ ...prev, [opt.key]: e.target.value })); setCurrentPage(1); }}
                            >
                              <option value="">All {opt.label}</option>
                              {opt.items.map(item => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button onClick={() => { setFilters(DEFAULT_FILTERS); setSearch(''); setCurrentPage(1); setIsFilterOpen(false); }} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Reset</button>
                      <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Done</button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => { setEditingUser(null); setIsFormOpen(true); }}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold px-5 py-2.5 transition-all shadow-md text-sm hover:opacity-90"
              >
                <Plus size={16} strokeWidth={2.5} /> ADD USER
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-emerald-500 border-b border-emerald-600 text-white uppercase text-[12px] font-semibold">
                  <th className="w-[10%] px-6 py-3 text-center">Sr. No.</th>
                  <th className="w-[35%] px-6 py-3 text-center">User Name</th>
                  <th className="w-[25%] px-6 py-3 text-center">Role</th>
                  <th className="w-[15%] px-6 py-3 text-center">Status</th>
                  <th className="w-[15%] px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.length > 0 ? paginated.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-center text-sm font-medium text-slate-500 align-middle">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-3 text-center text-sm font-medium text-slate-500 align-middle">
                      {u.name}
                    </td>
                    <td className="px-6 py-3 text-center align-middle">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-100">
                        {u.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center align-middle">
                      <Toggle active={u.status === 'Active'} onToggle={() => handleToggleStatus(u.id)} />
                    </td>
                    <td className="px-6 py-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => setViewUser(enriched.find(e => e.id === u.id))} className="text-slate-400 hover:text-emerald-600 transition-all p-1 hover:bg-emerald-50 rounded-full">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => { setEditingUser(u); setIsFormOpen(true); }} className="text-slate-400 hover:text-emerald-600 transition-all p-1 hover:bg-emerald-50 rounded-full">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget({ id: u.id, name: u.name })} className="text-slate-400 hover:text-rose-500 transition-all p-1 hover:bg-rose-50 rounded-full">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-sm text-slate-400">No matching records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalRecords={filtered.length}
            recordsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onRecordsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* View Popup */}
      {viewUser && (
        <UserViewPopup
          user={viewUser}
          onClose={() => setViewUser(null)}
          onEdit={() => { setViewUser(null); setEditingUser(enriched.find(e => e.id === viewUser.id)); setIsFormOpen(true); }}
          onToggleStatus={() => handleToggleStatus(viewUser.id)}
        />
      )}

      {/* Add / Edit Form */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingUser ? 'Update Profile' : 'Onboard New User'} size="xl">
        <UserForm
          user={editingUser}
          roles={INITIAL_ROLES}
          trusts={INITIAL_TRUSTS}
          sanghs={INITIAL_SANGHS}
          departments={INITIAL_DEPARTMENTS}
          onSave={handleSaveUser}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-[280px] rounded-[24px] p-6 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-medium text-slate-800 text-sm">Confirm Delete?</h3>
            <p className="text-[11px] text-slate-400 mt-1">{deleteTarget.name} will be removed permanently.</p>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 text-xs font-medium text-slate-400 bg-slate-50 rounded-xl">No</button>
              <button onClick={handleDelete} className="flex-1 py-2 text-xs font-medium text-white bg-rose-500 rounded-xl shadow-lg">Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── UserViewPopup — same style as LocationTable modal ────────────────────────
function UserViewPopup({ user, onClose, onEdit, onToggleStatus }) {
  const role = INITIAL_ROLES.find(r => r.id === user.roleId);

  const permGroups = PERM_GROUPS.map(group => {
    const granted = group.perms.filter(perm => {
      const key = `${group.key}_${perm.toLowerCase().replace(/\s+/g, '_')}`;
      if (!role) return false;
      if (role.permissions === 'all') return true;
      return Array.isArray(role.permissions) && role.permissions.includes(key);
    });
    return { ...group, granted };
  }).filter(g => g.granted.length > 0);

  const infoRows = [
    { label: 'Full Name',   value: user.name },
    { label: 'Email',       value: user.email },
    { label: 'Mobile',      value: user.phone },
    { label: 'Role',        value: user.roleName },
    { label: 'Trust',       value: user.trustName },
    { label: 'Sangh',       value: user.sanghName },
    { label: 'Department',  value: user.deptName },
    { label: 'Joined Date', value: user.joined },
    { label: 'Last Login',  value: user.lastLogin || '—' },
    { label: 'Committee',   value: user.committee ? `Yes — ${user.committeeRole || ''}` : 'No' },
    { label: 'Notes',       value: user.notes || '—' },
  ];

  const badgeColor = (perm) => {
    if (perm === 'View')   return 'bg-sky-50 text-sky-600 border-sky-100';
    if (perm === 'Create') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (perm === 'Edit')   return 'bg-amber-50 text-amber-600 border-amber-100';
    if (perm === 'Delete') return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-8 pt-6 pb-0 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="p-1.5 hover:bg-slate-50 rounded-full transition-colors">
                <ArrowLeft size={18} className="text-slate-600" />
              </button>
              <h3 className="font-medium text-slate-800 text-lg tracking-tight">User Details</h3>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>
          <div className="w-full h-[1px] bg-slate-100 mb-6" />
        </div>

        {/* Scrollable body */}
        <div className="px-8 pb-8 pt-2 overflow-y-auto space-y-3">

          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-1">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium border border-emerald-100 uppercase">{user.name}</span>
            <StatusBadge status={user.status} />
            <StatusBadge status={user.approvalStatus} />
          </div>

          {/* Info cards */}
          {infoRows.map(item => (
            <div key={item.label} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
              <p className="text-xs font-medium text-slate-400 uppercase mb-1">{item.label}</p>
              <p className="font-medium text-slate-800 text-sm">{item.value}</p>
            </div>
          ))}

          {/* Permissions card */}
          <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase mb-3">Permissions</p>
            {permGroups.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No permissions assigned</p>
            ) : (
              <div className="space-y-2.5">
                {permGroups.map(group => (
                  <div key={group.key} className="flex items-start gap-3">
                    <span className="text-[11px] font-semibold text-slate-600 w-[150px] shrink-0 pt-0.5 leading-tight">{group.label}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.granted.map(perm => (
                        <span key={perm} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor(perm)}`}>
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Status Toggle */}
          <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Quick Status Toggle</p>
              <Toggle active={user.status === 'Active'} onToggle={onToggleStatus} />
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={onEdit}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-emerald-200 transition-all"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
}
