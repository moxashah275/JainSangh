import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, Search, Pencil, Trash2, UsersRound, Shield, X, Save, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import StatusBadge from "../../components/common/StatusBadge"
import Modal from "../../components/common/Modal"
import EmptyState from "../../components/common/EmptyState"
import PermissionGrid from "./PermissionGrid"
import RoleFormModal from "./RoleFormModal"
import { INITIAL_ROLES, INITIAL_USERS, getUserCount, sortRoles } from "./roleData"

var PER_PAGE = 12
var TYPE_ICON = { System: Shield, Sangh: UsersRound, Trust: Shield }
var TYPE_S = { System: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' }, Sangh: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }, Trust: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' } }


function getCount(role) {
  if (role.permissions === 'all') return 'All';
  if (Array.isArray(role.permissions)) return role.permissions.length;
  return 0;
}

function RoleCard(p) {
  var r = p.role, Icon = TYPE_ICON[r.type] || Shield, s = TYPE_S[r.type] || TYPE_S.Sangh
  var uCnt = getUserCount(r.id, p.users)
  var c = r.permissions === 'all' ? 'Full Access' : 'Custom'
  return (
    <div onClick={p.onClick} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer relative" style={{ animation: 'cardIn 0.3s ease-out ' + (p.index * 0.03) + 's both' }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-all" />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className={s.text + ' w-4 h-4 shrink-0'} strokeWidth={2} />
            <div className="min-w-0">
              <h3 className="text-[12px] font-bold text-slate-800 group-hover:text-teal-700 truncate">{r.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={'text-[10px] font-bold uppercase tracking-wider ' + s.text}>{r.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] text-slate-400">{c}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={r.status} size="xs" />
        </div>
        <p className="text-[11px] text-slate-500 line-clamp-2">{r.description}</p>
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-700">{uCnt} Users</span>
          <span className="text-[11px] font-bold text-slate-400">{getCount(r)} Perms</span>
        </div>
      </div>
    </div>
  )
}

export default function RolesAndPermissionsPage() {
  var rolesState = useState(function() { try { var s = localStorage.getItem('rp_roles'); return s ? JSON.parse(s) : INITIAL_ROLES } catch(e) { return INITIAL_ROLES } })
  var roles = rolesState[0]; var setRoles = rolesState[1]
  var usersState = useState(function() { try { var s = localStorage.getItem('rp_users'); return s ? JSON.parse(s) : INITIAL_USERS } catch(e) { return INITIAL_USERS } })
  var users = usersState[0]; var setUsers = usersState[1]
  useEffect(function() { localStorage.setItem('rp_roles', JSON.stringify(roles)) }, [roles])
  useEffect(function() { localStorage.setItem('rp_users', JSON.stringify(users)) }, [users])

  var viewState = useState('list'); var view = viewState[0]; var setView = viewState[1]
  var editState = useState(null); var editRole = editState[0]; var setEditRole = editState[1]
  var detailState = useState(null); var detailRole = detailState[0]; var setDetailRole = detailState[1]
  var searchState = useState(''); var search = searchState[0]; var setSearch = searchState[1]
  var filterTypeState = useState('All'); var filterType = filterTypeState[0]; var setFilterType = filterTypeState[1]
  var pageState = useState(1); var page = pageState[0]; var setPage = pageState[1]
  var delConfirmState = useState(false); var delConfirm = delConfirmState[0]; var setDelConfirm = delConfirmState[1]
  var showUserFormState = useState(false); var showUserForm = showUserFormState[0]; var setShowUserForm = showUserFormState[1]
  var userFormState = useState({ name: '', email: '', phone: '', roleId: '' }); var userForm = userFormState[0]; var setUserForm = userFormState[1]
  var userErrorsState = useState({}); var userErrors = userErrorsState[0]; var setUserErrors = userErrorsState[1]

  var searchInputState = useState(''); var searchInput = searchInputState[0]; var setSearchInput = searchInputState[1]
  useEffect(function() { var t = setTimeout(function() { setSearch(searchInput) }, 300); return function() { clearTimeout(t) } }, [searchInput])
  var filtered = useMemo(function() {
    return roles.filter(function(r) {
      if (!r || !r.name) return false
      return r.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 && (filterType === 'All' || r.type === filterType)
    })
  }, [roles, search, filterType])
  var sorted = useMemo(function() { return sortRoles(filtered, 'name', 'asc', users) }, [filtered, users])
  var totalPages = Math.ceil(sorted.length / PER_PAGE); var paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  useEffect(function() { setPage(1) }, [search, filterType])

  var goList = function() { setView('list'); setEditRole(null); setDetailRole(null); setDelConfirm(false) }
  var goForm = function(r) { setEditRole(r || null); setView('form') }
  var goDetail = function(r) { setDetailRole(r); setView('detail'); setShowUserForm(false); setDelConfirm(false) }
  
  var handleSaveRole = useCallback(function(data) {
    if (editRole) { setRoles(function(p) { return p.map(function(r) { return r.id === editRole.id ? Object.assign({}, r, data) : r }) }) }
    else { var nId = Math.max.apply(null, [0].concat(roles.map(function(r) { return r.id }))) + 1; setRoles(function(p) { return p.concat([Object.assign({}, data, { id: nId, isLocked: false })]) }) }
    goList()
  }, [editRole, roles])

  var handleDeleteRole = useCallback(function() {
    if (!detailRole) return
    setRoles(function(p) { return p.filter(function(r) { return r.id !== detailRole.id }) })
    setUsers(function(p) { return p.filter(function(u) { return u.roleId !== detailRole.id }) })
    goList()
  }, [detailRole, users])

  var toggleStatus = function() {
    if (!detailRole) return
    var ns = detailRole.status === 'Active' ? 'Inactive' : 'Active'
    setRoles(function(p) { return p.map(function(r) { return r.id === detailRole.id ? Object.assign({}, r, { status: ns }) : r }) })
    setDetailRole(function(p) { return p ? Object.assign({}, p, { status: ns }) : p })
  }

  var validateUser = function() {
    var e = {}; if (!userForm.name.trim()) e.name = 'Name is required'; if (!userForm.roleId) e.roleId = 'Role is required'
    setUserErrors(e); return Object.keys(e).length === 0
  }

  var handleAddUser = function() {
    if (!validateUser()) return
    var nId = Math.max.apply(null, [0].concat(users.map(function(u) { return u.id }))) + 1
    
    setUsers(function(p) { return p.concat([Object.assign({}, userForm, { id: nId, joined: new Date().toISOString().split('T')[0], status: 'Active' })]) })
    
    setShowUserForm(false); setUserForm({ name: '', email: '', phone: '', roleId: '' }); setUserErrors({})
  }

  // LIST VIEW
  if (view === 'form') return <RoleFormModal isOpen={true} onClose={goList} onSave={handleSaveRole} role={editRole} />

  if (view === 'detail' && detailRole) {
    var Icon = TYPE_ICON[detailRole.type] || Shield; var s = TYPE_S[detailRole.type] || TYPE_S.Sangh
    var roleUsers = users.filter(function(u) { return u.roleId === detailRole.id })
    return (
      <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-slate-50 via-white to-teal-50/30" style={{ animation: 'pageIn 0.3s ease-out' }}>
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={goList} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-3">
                <div className={'w-10 h-10 rounded-xl flex items-center justify-center border ' + s.bg + ' border ' + s.border}>
                  <Icon className={s.text + ' w-5 h-5'} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[15px] font-bold text-slate-800">{detailRole.name}</h2>
                    <StatusBadge status={detailRole.status} />
                  </div>
                  <p className="text-[11px] text-slate-400">{detailRole.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={toggleStatus} className={'px-3 py-2 rounded-xl text-[12px] font-bold transition-colors ' + (detailRole.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : 'text-teal-600 hover:bg-teal-50')}>{detailRole.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
              {!detailRole.isLocked && (
                <span className="flex items-center gap-1.5">
                  <button onClick={function() { goForm(detailRole) }} className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-xl transition-colors border border-slate-200 shadow-sm"><Pencil className="w-3.5 h-3.5 mr-1" />Edit</button>
                  {!delConfirm ? (
                    <button onClick={function() { setDelConfirm(true) }} className="px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 text-[12px] font-bold rounded-xl transition-colors border border-rose-100"><Trash2 className="w-3.5 h-3.5 mr-1" />Delete</button>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 rounded-lg px-2 py-1" style={{ animation: 'slideDown 0.15s ease-out' }}>
                      <span className="text-[9px] font-bold text-rose-700">Delete?</span>
                      <button onClick={handleDeleteRole} className="text-[9px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded hover:bg-rose-700">Yes</button>
                      <button onClick={function() { setDelConfirm(false) }} className="text-[9px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded hover:bg-slate-100 border border-slate-200">No</button>
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
          {/* Permissions */}
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 mb-2">Module Permissions</h3>
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <PermissionGrid role={detailRole} filterType={detailRole.permissions === 'all' ? null : detailRole.type} />
            </div>
          </div>
          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold text-slate-800">Members ({roleUsers.length})</h3>
              <button onClick={function() { setShowUserForm(true); setUserForm({ name: '', email: '', phone: '', roleId: '' }); setUserErrors({}) }} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-[12px] font-bold rounded-xl hover:bg-teal-700 transition-all"><PlusCircle className="w-4 h-4" />Add Member</button>
            </div>
            {showUserForm && (
              <div className="bg-teal-50/30 p-4 rounded-xl border border-teal-100 mb-3" style={{ animation: 'slideDown 0.2s ease-out' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-slate-700">{editRole ? 'Edit Member' : 'Add New Member'}</h3>
                  <button onClick={function() { setShowUserForm(false) }} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Name <span className="text-rose-400">*</span></label>
                    <input 
                      value={userForm.name} 
                      onChange={function(e) { setUserForm(Object.assign({}, userForm, { name: e.target.value })) }} 
                      placeholder="Full name" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all" 
                    />
                    {userErrors.name && <p className="text-[10px] text-rose-500">{userErrors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Email</label>
                    <input 
                      value={userForm.email} 
                      onChange={function(e) { setUserForm(Object.assign({}, userForm, { email: e.target.value })) }} 
                      placeholder="email@example.com" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Phone</label>
                    <input 
                      value={userForm.phone} 
                      onChange={function(e) { setUserForm(Object.assign({}, userForm, { phone: e.target.value })) }} 
                      placeholder="9876543210" 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-600">Role <span className="text-rose-400">*</span></label>
                    <select 
                      value={userForm.roleId} 
                      onChange={function(e) { setUserForm(Object.assign({}, userForm, { roleId: e.target.value })) }} 
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-teal-500 transition-all cursor-pointer"
                    >
                      <option value="">Select Role</option>
                      {(roles || []).map(function(r) { return <option key={r.id} value={r.id}>{r.name} ({r.type})</option> })}
                    </select>
                    {userErrors.roleId && <p className="text-[10px] text-rose-500">{userErrors.roleId}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={function() { setShowUserForm(false) }} className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-[12px] font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={handleAddUser} className="flex-1 py-2 bg-teal-600 text-white text-[12px] font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"><Save className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />{editRole ? 'Update' : 'Add'}</button>
                </div>
              </div>
            )}
            {!showUserForm && roleUsers.length === 0 && <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200"><p className="text-[12px] text-slate-400 font-medium">No members assigned yet</p></div>}
            {roleUsers.length > 0 && (
              <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-[12px]">
                  <thead><tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {roleUsers.map(function(u) {
                      var initials = u.name ? u.name.split(' ').map(function(n) { return n[0] }).join('').toUpperCase().slice(0, 2) : 'U'
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px]">{initials}</div><span className="font-semibold text-slate-700">{u.name}</span></div></td>
                          <td className="px-4 py-3 text-slate-500">{u.email || '-'}</td>
                          <td className="px-4 py-3 text-slate-500">{u.joined}</td>
                          <td className="px-4 py-3"><StatusBadge status={u.status} size="xs" /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="w-7 h-7 rounded-md bg-slate-50 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all"><Pencil className="w-3 h-3" /></button>
                              <button className="w-7 h-7 rounded-md bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // LIST VIEW
  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-4 pb-6 bg-[#f8fafc] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-bold text-teal-700 tracking-tight">Roles & Permissions</h1>
            <p className="text-[12px] text-slate-400 mt-0.5">Manage user roles and module access control</p>
          </div>
          <button onClick={function() { goForm(null) }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/10 active:scale-[0.98] transition-all duration-200">
            <Plus className="w-4 h-4" strokeWidth={2.5} />Add New Role
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
          <div className="relative w-full sm:w-72">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search roles..." value={searchInput} onChange={function(e) { setSearchInput(e.target.value) }} className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all" /></div>
          </div>
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 h-[42px] gap-1 ml-auto">
            {['All', 'System', 'Sangh', 'Trust'].map(function(t) {
              return <button key={t} onClick={function() { setFilterType(t) }} className={'px-5 h-full rounded-md text-[13px] font-bold transition-all ' + (filterType === t ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')}>{t}</button>
            })}
          </div>
        </div>
        {filtered.length === 0 ? <EmptyState message="No roles found" description={search ? 'No results for "' + search + '"' : 'No roles match the current filter'} action={<button onClick={function() { setFilterType('All'); setSearchInput('') }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"><X className="w-3.5 h-3.5" />Clear Filters</button>} /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(function(role, i) { return <RoleCard key={role.id} role={role} onClick={function() { goDetail(role) }} users={users} index={i} /> })}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <span className="text-[12px] font-bold text-slate-400">Showing {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}</span>
            <div className="flex items-center gap-1.5">
              <button onClick={function() { setPage(page - 1) }} disabled={page === 1} className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-white border border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, function(_, i) { return i + 1 }).map(function(p) { return <button key={p} onClick={function() { setPage(p) }} className={'w-8 h-8 rounded-lg text-[12px] font-bold transition-all ' + (page === p ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50')}>{p}</button> })}
              <button onClick={function() { setPage(page + 1) }} disabled={page === totalPages} className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-white border border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }" }} />
    </div>
  )
}