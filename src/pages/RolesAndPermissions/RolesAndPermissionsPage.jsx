import React, { useState, useMemo, useEffect, useCallback } from "react"
import {
  Plus, Search, Shield, Pencil, Trash2,
  ChevronLeft, ChevronRight, ShieldCheck, Mail,
  CalendarDays, UsersRound, ArrowRight, X, ArrowLeft,
  UserPlus, Save, Users, Landmark
} from "lucide-react"
import StatusBadge from "../../components/common/StatusBadge"
import PermissionGrid from "./PermissionGrid"
import RoleFormModal from "./RoleFormModal"
import {
  INITIAL_ROLES, INITIAL_USERS, getCount, getUserCount,
  getTotalPerms, sortRoles
} from "./roleData"

var PER_PAGE = 9
var TYPE_ICON = { System: Shield, Sangh: Users, Trust: Landmark }
var TYPE_S = {
  System: { text: "text-sky-600",    bg: "bg-sky-50",    border: "border-sky-100" },
  Sangh:  { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  Trust:  { text: "text-rose-600",   bg: "bg-rose-50",   border: "border-rose-100" },
}

/* ═══ Role Card ═══ */
var RoleCard = React.memo(function(props) {
  var role = props.role
  var Icon = TYPE_ICON[role.type] || Shield
  var s = TYPE_S[role.type] || TYPE_S.Sangh
  var uCnt = getUserCount(role.id, props.users)
  var cnt = getCount(role)

  return (
    <div onClick={props.onClick} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer relative"
      style={{ animation: "cardIn 0.3s ease-out " + (props.index * 0.04) + "s both" }}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Icon className={s.text + " w-5 h-5 shrink-0"} strokeWidth={2} />
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold text-slate-800 transition-colors group-hover:text-teal-700 truncate">{role.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={"text-[11px] font-bold uppercase tracking-wider " + s.text}>{role.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[11px] font-medium text-slate-400 truncate">{role.permissions === "all" ? "Full Access" : "Custom Perms"}</span>
              </div>
            </div>
          </div>
          <div className="shrink-0"><StatusBadge status={role.status} /></div>
        </div>
        <p className="text-[12px] font-medium text-slate-500 leading-relaxed min-h-[36px] line-clamp-2">{role.description}</p>
      </div>
      <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-50 bg-slate-50/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <UsersRound className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-700">{uCnt}</span>
            <span className="text-[11px] text-slate-500 font-medium">Users</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-[13px] font-bold text-slate-700">{cnt}</span>
            <span className="text-[11px] text-slate-500 font-medium">Perms</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-teal-600 transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </div>
  )
})
RoleCard.displayName = "RoleCard"

/* ═══ Pagination ═══ */
var Pagination = function(props) {
  return (
    <div className="flex items-center justify-between pt-4">
      <span className="text-[12px] font-bold text-slate-400">Showing {(props.page - 1) * props.perPage + 1}–{Math.min(props.page * props.perPage, props.totalItems)} of {props.totalItems}</span>
      <div className="flex items-center gap-2">
        <button onClick={function() { props.onChange(props.page - 1) }} disabled={props.page === 1} className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-white border border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all"><ChevronLeft className="w-5 h-5" /></button>
        {Array.from({ length: props.totalPages }, function(_, i) { return i + 1 }).map(function(p) {
          return <button key={p} onClick={function() { props.onChange(p) }} className={"w-8 h-8 rounded-lg text-[12px] font-bold transition-all " + (props.page === p ? "bg-teal-600 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50")}>{p}</button>
        })}
        <button onClick={function() { props.onChange(props.page + 1) }} disabled={props.page === props.totalPages} className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-white border border-transparent disabled:opacity-30 disabled:pointer-events-none transition-all"><ChevronRight className="w-5 h-5" /></button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */
export default function RolesAndPermissionsPage() {
  var rolesState = useState(function() {
    try { var s = localStorage.getItem("rp_roles"); return s ? JSON.parse(s) : INITIAL_ROLES } catch(e) { return INITIAL_ROLES }
  })
  var roles = rolesState[0]; var setRoles = rolesState[1]

  var usersState = useState(function() {
    try { var s = localStorage.getItem("rp_users"); return s ? JSON.parse(s) : INITIAL_USERS } catch(e) { return INITIAL_USERS }
  })
  var users = usersState[0]; var setUsers = usersState[1]

  useEffect(function() { localStorage.setItem("rp_roles", JSON.stringify(roles)) }, [roles])
  useEffect(function() { localStorage.setItem("rp_users", JSON.stringify(users)) }, [users])

  var viewState = useState('list'); var view = viewState[0]; var setView = viewState[1]
  var editRoleState = useState(null); var editRole = editRoleState[0]; var setEditRole = editRoleState[1]
  var detailRoleState = useState(null); var detailRole = detailRoleState[0]; var setDetailRole = detailRoleState[1]

  var searchInputState = useState(""); var searchInput = searchInputState[0]; var setSearchInput = searchInputState[1]
  var searchState = useState(""); var search = searchState[0]; var setSearch = searchState[1]
  useEffect(function() { var t = setTimeout(function() { setSearch(searchInput) }, 300); return function() { clearTimeout(t) } }, [searchInput])

  var filterTypeState = useState("All"); var filterType = filterTypeState[0]; var setFilterType = filterTypeState[1]

  var filtered = useMemo(function() {
    return roles.filter(function(r) {
      if (!r || !r.name) return false
      return r.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 && (filterType === "All" || r.type === filterType)
    })
  }, [roles, search, filterType])

  var sorted = useMemo(function() { return sortRoles(filtered, "name", "asc", users) }, [filtered, users])
  var pageState = useState(1); var page = pageState[0]; var setPage = pageState[1]
  var totalPages = Math.ceil(sorted.length / PER_PAGE)
  var paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  useEffect(function() { setPage(1) }, [search, filterType])
  var clearFilters = function() { setSearchInput(""); setFilterType("All") }

  var userSearchState = useState(""); var userSearch = userSearchState[0]; var setUserSearch = userSearchState[1]
  var showUserFormState = useState(false); var showUserForm = showUserFormState[0]; var setShowUserForm = showUserFormState[1]
  var editingUserState = useState(null); var editingUser = editingUserState[0]; var setEditingUser = editingUserState[1]
  var userFormState = useState({ name: '', email: '', phone: '', status: 'Active' }); var userForm = userFormState[0]; var setUserForm = userFormState[1]
  var userErrorsState = useState({}); var userErrors = userErrorsState[0]; var setUserErrors = userErrorsState[1]
  var deleteConfirmState = useState(null); var deleteConfirm = deleteConfirmState[0]; var setDeleteConfirm = deleteConfirmState[1]
  var roleDeleteConfirmState = useState(false); var roleDeleteConfirm = roleDeleteConfirmState[0]; var setRoleDeleteConfirm = roleDeleteConfirmState[1]

  var goList = function() { setView('list'); setEditRole(null); setDetailRole(null); setRoleDeleteConfirm(false) }
  var goForm = function(role) { setEditRole(role || null); setView('form') }
  var goDetail = function(role) { setDetailRole(role); setView('detail'); setUserSearch(""); setShowUserForm(false); setEditingUser(null); setDeleteConfirm(null); setRoleDeleteConfirm(false) }

  var handleSaveRole = useCallback(function(data) {
    if (editRole) {
      setRoles(function(prev) { return prev.map(function(r) { return r.id === editRole.id ? Object.assign({}, r, data) : r }) })
    } else {
      var newId = Math.max.apply(null, [0].concat(roles.map(function(r) { return r.id || 0 }))) + 1
      setRoles(function(prev) { return prev.concat([Object.assign({}, data, { id: newId, isLocked: false })]) })
    }
    goList()
  }, [editRole, roles])

  var handleDeleteRole = useCallback(function() {
    if (!detailRole) return
    setRoles(function(prev) { return prev.filter(function(r) { return r.id !== detailRole.id }) })
    setUsers(function(prev) { return prev.filter(function(u) { return u.roleId !== detailRole.id }) })
    goList()
  }, [detailRole])

  var toggleRoleStatus = function() {
    if (!detailRole) return
    var ns = detailRole.status === "Active" ? "Inactive" : "Active"
    setRoles(function(prev) { return prev.map(function(r) { return r.id === detailRole.id ? Object.assign({}, r, { status: ns }) : r }) })
    setDetailRole(function(prev) { return prev ? Object.assign({}, prev, { status: ns }) : prev })
  }

  var openAddUser = function() { setEditingUser(null); setUserForm({ name: '', email: '', phone: '', status: 'Active' }); setUserErrors({}); setShowUserForm(true) }
  var openEditUser = function(u) { setEditingUser(u); setUserForm({ name: u.name, email: u.email, phone: u.phone || '', status: u.status }); setUserErrors({}); setShowUserForm(true) }
  var closeUserForm = function() { setShowUserForm(false); setEditingUser(null); setUserErrors({}) }

  var validateUser = function() {
    var e = {}
    if (!userForm.name.trim()) e.name = 'Name is required'
    if (!userForm.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email.trim())) e.email = 'Invalid email'
    setUserErrors(e); return Object.keys(e).length === 0
  }

  var handleSaveUser = function() {
    if (!validateUser()) return
    if (editingUser) {
      setUsers(function(prev) { return prev.map(function(u) { return u.id === editingUser.id ? Object.assign({}, u, { name: userForm.name.trim(), email: userForm.email.trim(), phone: userForm.phone.trim(), status: userForm.status }) : u }) })
    } else {
      var newId = Math.max.apply(null, [0].concat(users.map(function(u) { return u.id || 0 }))) + 1
      setUsers(function(prev) { return prev.concat([Object.assign({}, userForm, { id: newId, name: userForm.name.trim(), email: userForm.email.trim(), phone: userForm.phone.trim(), roleId: detailRole.id, joined: new Date().toISOString().split('T')[0] })]) })
    }
    closeUserForm()
  }

  var handleDeleteUser = function(userId) { setUsers(function(prev) { return prev.filter(function(u) { return u.id !== userId }) }); setDeleteConfirm(null) }

  var roleUsers = useMemo(function() { return detailRole ? users.filter(function(u) { return u.roleId === detailRole.id }) : [] }, [users, detailRole])
  var filteredRoleUsers = useMemo(function() { return roleUsers.filter(function(u) { return !userSearch || u.name.toLowerCase().indexOf(userSearch.toLowerCase()) !== -1 || u.email.toLowerCase().indexOf(userSearch.toLowerCase()) !== -1 }) }, [roleUsers, userSearch])

  /* ═══ FORM VIEW ═══ */
  if (view === 'form') {
    return <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7"><RoleFormModal isOpen={true} onClose={goList} onSave={handleSaveRole} role={editRole} /></div>
  }

  /* ═══ DETAIL VIEW ═══ */
  if (view === 'detail' && detailRole) {
    var Icon = TYPE_ICON[detailRole.type] || Shield
    var s = TYPE_S[detailRole.type] || TYPE_S.Sangh
    var inputCls = 'w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all font-medium'

    return (
      <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30" style={{ animation: 'pageIn 0.3s ease-out' }}>
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button onClick={goList} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
              <div className="flex items-center gap-3">
                <div className={"w-12 h-12 rounded-xl " + s.bg + " flex items-center justify-center shrink-0 border " + s.border}><Icon className={s.text + " w-5 h-5"} strokeWidth={2} /></div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">{detailRole.name}</h2>
                    <StatusBadge status={detailRole.status} />
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">{roleUsers.length} Member{roleUsers.length !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-[12px] font-medium text-slate-400 mt-0.5">{detailRole.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={toggleRoleStatus} className={"px-4 py-2 rounded-lg text-[12px] font-bold transition-colors " + (detailRole.status === "Active" ? "text-rose-600 hover:bg-rose-50" : "text-teal-600 hover:bg-teal-50")}>{detailRole.status === "Active" ? "Deactivate" : "Activate"}</button>
              {!detailRole.isLocked && (
                <span>
                  <button onClick={function() { goForm(detailRole) }} className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg transition-colors border border-slate-200 shadow-sm"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                  {!roleDeleteConfirm ? (
                    <button onClick={function() { setRoleDeleteConfirm(true) }} className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 text-[12px] font-bold rounded-lg transition-colors border border-rose-100 shadow-sm ml-2"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                  ) : (
                    <span className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5 ml-2" style={{ animation: 'slideDown 0.2s ease-out' }}>
                      <span className="text-[10px] font-bold text-rose-700">Delete this role?</span>
                      <button onClick={handleDeleteRole} className="px-3 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-md hover:bg-rose-700 transition-colors">Yes</button>
                      <button onClick={function() { setRoleDeleteConfirm(false) }} className="px-3 py-1 bg-white text-slate-600 text-[11px] font-bold rounded-md hover:bg-slate-100 transition-colors border border-slate-200">No</button>
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
              <h3 className="text-[14px] font-bold text-slate-800">Members</h3>
            </div>

            <button onClick={openAddUser} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/10 active:scale-[0.98] transition-all duration-200 mb-3">
              <UserPlus className="w-4 h-4" strokeWidth={2.5} /> Add Member
            </button>

            {roleUsers.length > 0 && (
              <div className="relative max-w-xs mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search members…" value={userSearch} onChange={function(e) { setUserSearch(e.target.value) }} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all font-medium" />
              </div>
            )}

            {showUserForm && (
              <div className="bg-teal-50/30 p-4 rounded-xl border border-teal-100 mb-3" style={{ animation: 'slideDown 0.2s ease-out' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold text-slate-800">{editingUser ? 'Edit Member' : 'Add New Member'}</h3>
                  <button onClick={closeUserForm} className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors border border-slate-200"><X className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-1 block">Name <span className="text-rose-400">*</span></label>
                    <input type="text" value={userForm.name} onChange={function(e) { setUserForm(Object.assign({}, userForm, { name: e.target.value })) }} placeholder="Full name" className={inputCls + (userErrors.name ? ' !border-rose-300' : '')} />
                    {userErrors.name && <p className="text-[11px] text-rose-500 font-medium mt-1">{userErrors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-1 block">Email <span className="text-rose-400">*</span></label>
                    <input type="email" value={userForm.email} onChange={function(e) { setUserForm(Object.assign({}, userForm, { email: e.target.value })) }} placeholder="email@example.com" className={inputCls + (userErrors.email ? ' !border-rose-300' : '')} />
                    {userErrors.email && <p className="text-[11px] text-rose-500 font-medium mt-1">{userErrors.email}</p>}
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-1 block">Phone</label>
                    <input type="tel" value={userForm.phone} onChange={function(e) { setUserForm(Object.assign({}, userForm, { phone: e.target.value })) }} placeholder="9876543210" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-[12px] font-bold text-slate-700 mb-1 block">Status</label>
                    <div className="flex items-center gap-2 h-[38px]">
                      {['Active', 'Inactive'].map(function(st) {
                        return <button key={st} type="button" onClick={function() { setUserForm(Object.assign({}, userForm, { status: st })) }} className={"flex-1 py-2 rounded-lg text-[12px] font-bold transition-all border " + (userForm.status === st ? (st === 'Active' ? 'bg-emerald-600 text-white border-transparent' : 'bg-slate-700 text-white border-transparent') : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50')}>{st}</button>
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button onClick={closeUserForm} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={handleSaveUser} className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-[12px] font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm"><Save className="w-3.5 h-3.5" strokeWidth={2.5} />{editingUser ? 'Update' : 'Add Member'}</button>
                </div>
              </div>
            )}

            {filteredRoleUsers.length === 0 && !showUserForm ? (
              <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <UsersRound className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-[12px] text-slate-400 font-medium">{roleUsers.length === 0 ? 'No members assigned yet' : 'No matches for "' + userSearch + '"'}</p>
              </div>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        {["Member", "Email", "Joined", "Status", "Actions"].map(function(h) { return <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th> })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredRoleUsers.map(function(u) {
                        var initials = u.name ? u.name.split(" ").map(function(n) { return n[0] }).join("").toUpperCase().slice(0, 2) : "U"
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={"w-8 h-8 rounded-lg " + s.bg + " border " + s.border + " flex items-center justify-center " + s.text + " font-bold text-[11px] shrink-0"}>{initials}</div>
                                <span className="font-semibold text-slate-700">{u.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500 font-medium"><span className="inline-flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" />{u.email}</span></td>
                            <td className="px-4 py-3 text-slate-500 font-medium"><span className="inline-flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5 text-slate-400" />{u.joined}</span></td>
                            <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                            <td className="px-4 py-3">
                              {deleteConfirm === u.id ? (
                                <div className="flex items-center gap-1">
                                  <button onClick={function() { handleDeleteUser(u.id) }} className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-md hover:bg-rose-700 transition-colors">Confirm</button>
                                  <button onClick={function() { setDeleteConfirm(null) }} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md hover:bg-slate-200 transition-colors">Cancel</button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={function() { openEditUser(u) }} className="w-7 h-7 rounded-md bg-slate-50 hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                                  <button onClick={function() { setDeleteConfirm(u.id) }} className="w-7 h-7 rounded-md bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; } @keyframes pageIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }" }} />
      </div>
    )
  }

  /* ═══ LIST VIEW ═══ */
  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-4 pb-6 bg-[#f8fafc] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[20px] font-bold text-teal-700 tracking-tight">Roles & Permissions</h1>
            <p className="text-[12px] font-medium text-slate-400 mt-0.5">Manage user roles and module access control</p>
          </div>
          <button onClick={function() { goForm(null) }} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/10 active:scale-[0.98] transition-all duration-200">
            <Plus className="w-4 h-4" strokeWidth={2.5} /> Add New Role
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search roles…" value={searchInput} onChange={function(e) { setSearchInput(e.target.value) }} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all font-medium" />
          </div>
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 h-[42px] gap-2 ml-auto">
            {["All", "System", "Sangh", "Trust"].map(function(t) {
              return <button key={t} onClick={function() { setFilterType(t) }} className={"px-5 h-full rounded-md text-[13px] font-bold transition-all " + (filterType === t ? "bg-teal-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50")}>{t}</button>
            })}
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 mx-auto flex items-center justify-center mb-4"><Shield className="w-6 h-6 text-slate-300" /></div>
            <h3 className="text-[14px] font-bold text-slate-600 mb-1">No roles found</h3>
            <p className="text-[12px] text-slate-400 font-medium mb-4">{search ? 'No results for "' + search + '"' : "No roles match the current filter"}</p>
            {(search || filterType !== "All") && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 text-[12px] font-bold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"><X className="w-3.5 h-3.5" /> Clear Filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map(function(role, i) { return <RoleCard key={role.id || i} role={role} onClick={function() { goDetail(role) }} index={i} users={users} /> })}
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={sorted.length} perPage={PER_PAGE} />}
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'); * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; } @keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }" }} />
    </div>
  )
}