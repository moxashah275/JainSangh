import React, { useState, useMemo } from 'react'
import {
  Plus, Pencil, Trash2, Shield, ShieldCheck, Eye,
  Users, Landmark, Settings, Check, Minus, Copy,
  LayoutDashboard, MapPin, HandHeart, BookOpen, BarChart3,
  Bell, Gem, UserCog, Lock
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'

/* ═══════════════════════════════════════════════════════════════
   PERMISSION DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */
const PERM_GROUPS = [
  {
    key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard,
    perms: [{ key: 'dashboard_view', label: 'View' }]
  },
  {
    key: 'location', label: 'Location Setup', icon: MapPin,
    perms: [
      { key: 'location_view', label: 'View' },
      { key: 'location_create', label: 'Create' },
      { key: 'location_edit', label: 'Edit' },
      { key: 'location_delete', label: 'Delete' },
    ]
  },
  {
    key: 'sangh', label: 'Sangh Management', icon: Users,
    perms: [
      { key: 'sangh_view', label: 'View' },
      { key: 'sangh_create', label: 'Create' },
      { key: 'sangh_edit', label: 'Edit' },
      { key: 'sangh_delete', label: 'Delete' },
    ]
  },
  {
    key: 'trust', label: 'Trust Management', icon: Landmark,
    perms: [
      { key: 'trust_view', label: 'View' },
      { key: 'trust_create', label: 'Create' },
      { key: 'trust_edit', label: 'Edit' },
      { key: 'trust_delete', label: 'Delete' },
    ]
  },
  {
    key: 'donations', label: 'Donations', icon: HandHeart,
    perms: [
      { key: 'donations_view', label: 'View' },
      { key: 'donations_create', label: 'Create' },
      { key: 'donations_edit', label: 'Edit' },
      { key: 'donations_delete', label: 'Delete' },
      { key: 'donations_export80g', label: 'Export 80G' },
      { key: 'donations_export', label: 'Export' },
    ]
  },
  {
    key: 'members', label: 'Members & Families', icon: Users,
    perms: [
      { key: 'members_view', label: 'View' },
      { key: 'members_create', label: 'Create' },
      { key: 'members_edit', label: 'Edit' },
      { key: 'members_delete', label: 'Delete' },
      { key: 'members_export', label: 'Export' },
    ]
  },
  {
    key: 'derasar', label: 'Derasar', icon: Gem,
    perms: [
      { key: 'derasar_view', label: 'View' },
      { key: 'derasar_create', label: 'Create' },
      { key: 'derasar_edit', label: 'Edit' },
      { key: 'derasar_delete', label: 'Delete' },
    ]
  },
  {
    key: 'pathshala', label: 'Pathshala', icon: BookOpen,
    perms: [
      { key: 'pathshala_view', label: 'View' },
      { key: 'pathshala_create', label: 'Create' },
      { key: 'pathshala_edit', label: 'Edit' },
      { key: 'pathshala_delete', label: 'Delete' },
      { key: 'pathshala_exams', label: 'Manage Exams' },
    ]
  },
  {
    key: 'reports', label: 'Reports', icon: BarChart3,
    perms: [
      { key: 'reports_view', label: 'View' },
      { key: 'reports_export', label: 'Export' },
    ]
  },
  {
    key: 'notifications', label: 'Notifications', icon: Bell,
    perms: [
      { key: 'notifications_view', label: 'View' },
      { key: 'notifications_send', label: 'Send' },
    ]
  },
  {
    key: 'roles', label: 'Role & Permissions', icon: UserCog,
    perms: [
      { key: 'roles_view', label: 'View' },
      { key: 'roles_create', label: 'Create' },
      { key: 'roles_edit', label: 'Edit' },
      { key: 'roles_delete', label: 'Delete' },
    ]
  },
  {
    key: 'settings', label: 'Settings', icon: Settings,
    perms: [
      { key: 'settings_view', label: 'View' },
      { key: 'settings_edit', label: 'Edit' },
    ]
  },
]

const TOTAL_PERMS = PERM_GROUPS.reduce((sum, g) => sum + g.perms.length, 0)
const ALL_PERM_KEYS = PERM_GROUPS.flatMap(g => g.perms.map(p => p.key))


/* ═══════════════════════════════════════════════════════════════
   INITIAL ROLES DATA
   ═══════════════════════════════════════════════════════════════ */
const INITIAL_ROLES = [
  {
    id: 1, name: 'Super Admin', type: 'System',
    description: 'Complete system access — all modules, all actions',
    usersCount: 1, status: 'Active', isLocked: true,
    permissions: 'all'
  },
  {
    id: 2, name: 'Sangh President', type: 'Sangh',
    description: 'Oversees sangh operations, member management, approvals',
    usersCount: 2, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view', 'location_view',
      'sangh_view', 'sangh_create', 'sangh_edit',
      'trust_view',
      'donations_view', 'donations_create', 'donations_edit', 'donations_export80g', 'donations_export',
      'members_view', 'members_create', 'members_edit', 'members_export',
      'derasar_view', 'derasar_create', 'derasar_edit',
      'pathshala_view',
      'reports_view', 'reports_export',
      'notifications_view', 'notifications_send',
      'settings_view',
    ]
  },
  {
    id: 3, name: 'Sangh Secretary', type: 'Sangh',
    description: 'Day-to-day sangh operations, events, and records',
    usersCount: 3, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view', 'location_view',
      'sangh_view', 'sangh_create', 'sangh_edit',
      'trust_view',
      'donations_view', 'donations_create', 'donations_edit',
      'members_view', 'members_create', 'members_edit',
      'derasar_view',
      'pathshala_view',
      'reports_view',
      'notifications_view', 'notifications_send',
    ]
  },
  {
    id: 4, name: 'Sangh Treasurer', type: 'Sangh',
    description: 'Manages sangh finances, donations, and financial reports',
    usersCount: 2, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view',
      'donations_view', 'donations_create', 'donations_edit', 'donations_export80g', 'donations_export',
      'members_view', 'members_export',
      'reports_view', 'reports_export',
      'notifications_view',
    ]
  },
  {
    id: 5, name: 'Trust Chairman', type: 'Trust',
    description: 'Trust leadership, strategic decisions, and approvals',
    usersCount: 1, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view', 'location_view',
      'sangh_view',
      'trust_view', 'trust_create', 'trust_edit',
      'donations_view', 'donations_create', 'donations_edit', 'donations_export80g', 'donations_export',
      'members_view',
      'derasar_view', 'derasar_create', 'derasar_edit',
      'pathshala_view',
      'reports_view', 'reports_export',
      'notifications_view', 'notifications_send',
      'settings_view',
    ]
  },
  {
    id: 6, name: 'Trust Secretary', type: 'Trust',
    description: 'Trust operations, committee management, and documentation',
    usersCount: 2, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view', 'location_view',
      'sangh_view',
      'trust_view', 'trust_create', 'trust_edit',
      'donations_view',
      'members_view',
      'derasar_view',
      'pathshala_view',
      'reports_view',
      'notifications_view', 'notifications_send',
    ]
  },
  {
    id: 7, name: 'Trust Treasurer', type: 'Trust',
    description: 'Manages trust finances, donations, and banking',
    usersCount: 2, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view',
      'trust_view',
      'donations_view', 'donations_create', 'donations_edit', 'donations_export80g', 'donations_export',
      'reports_view', 'reports_export',
      'notifications_view',
    ]
  },
  {
    id: 8, name: 'Member (Sangh)', type: 'Sangh',
    description: 'Basic view-only access for sangh members',
    usersCount: 450, status: 'Active', isLocked: false,
    permissions: [
      'dashboard_view',
      'derasar_view',
      'pathshala_view',
      'notifications_view',
      'reports_view',
    ]
  },
]


/* ═══════════════════════════════════════════════════════════════
   STYLE CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const TYPE_STYLES = {
  System:  { bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-500' },
  Sangh:   { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Trust:   { bg: 'bg-green-50',   text: 'text-green-700',   dot: 'bg-green-500' },
}

const TYPE_ICON = { System: Shield, Sangh: Users, Trust: Landmark }


/* ═══════════════════════════════════════════════════════════════
   REUSABLE: Permission Checkbox
   ═══════════════════════════════════════════════════════════════ */
function PermCheckbox({ checked, indeterminate = false, onChange, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-[18px] h-[18px]' : 'w-5 h-5'
  const iconSz = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange() }}
      className={`${sz} rounded-md flex items-center justify-center transition-all duration-150 active:scale-90 shrink-0 ${
        checked
          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/25'
          : indeterminate
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
      }`}
    >
      {indeterminate ? <Minus className={iconSz} strokeWidth={3} /> : <Check className={iconSz} strokeWidth={3} />}
    </button>
  )
}


/* ═══════════════════════════════════════════════════════════════
   REUSABLE: Type Badge
   ═══════════════════════════════════════════════════════════════ */
function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] || TYPE_STYLES.Sangh
  const Icon = TYPE_ICON[type] || Shield
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {type}
    </span>
  )
}


/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */
function getPerms(role) {
  return role.permissions === 'all' ? ALL_PERM_KEYS : role.permissions
}
function getPermCount(role) {
  return role.permissions === 'all' ? TOTAL_PERMS : role.permissions.length
}
function hasPerm(role, permKey) {
  return role.permissions === 'all' || role.permissions.includes(permKey)
}


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function RolePermission() {
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [activeTab, setActiveTab] = useState('roles')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('All')

  // Modal states
  const [formModal, setFormModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [viewRole, setViewRole] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Form state
  const [form, setForm] = useState({
    name: '', type: 'Sangh', description: '', cloneFrom: '', permissions: []
  })

  // ── Filtered roles ──
  const filtered = useMemo(() => {
    return roles.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'All' || r.type === filterType
      return matchSearch && matchType
    })
  }, [roles, search, filterType])

  // ── Form helpers ──
  const resetForm = () => {
    setForm({ name: '', type: 'Sangh', description: '', cloneFrom: '', permissions: [] })
    setEditingRole(null)
  }

  const openAdd = () => { resetForm(); setFormModal(true) }

  const openEdit = (role) => {
    setEditingRole(role)
    setForm({
      name: role.name,
      type: role.type,
      description: role.description,
      cloneFrom: '',
      permissions: [...getPerms(role)],
    })
    setFormModal(true)
  }

  const handleClone = (roleId) => {
    const source = roles.find(r => r.id === parseInt(roleId))
    if (source) {
      setForm(prev => ({ ...prev, cloneFrom: roleId, permissions: [...getPerms(source)] }))
    } else {
      setForm(prev => ({ ...prev, cloneFrom: roleId, permissions: [] }))
    }
  }

  const toggleFormPerm = (permKey) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permKey)
        ? prev.permissions.filter(p => p !== permKey)
        : [...prev.permissions, permKey]
    }))
  }

  const toggleAllFormGroup = (groupKey) => {
    const groupPerms = PERM_GROUPS.find(g => g.key === groupKey)?.perms.map(p => p.key) || []
    const allChecked = groupPerms.every(p => form.permissions.includes(p))
    setForm(prev => ({
      ...prev,
      permissions: allChecked
        ? prev.permissions.filter(p => !groupPerms.includes(p))
        : [...new Set([...prev.permissions, ...groupPerms])]
    }))
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingRole) {
      setRoles(prev => prev.map(r =>
        r.id === editingRole.id
          ? { ...r, name: form.name, type: form.type, description: form.description, permissions: [...form.permissions] }
          : r
      ))
    } else {
      setRoles(prev => [...prev, {
        id: Math.max(...prev.map(r => r.id)) + 1,
        name: form.name,
        type: form.type,
        description: form.description,
        usersCount: 0,
        status: 'Active',
        isLocked: false,
        permissions: [...form.permissions],
      }])
    }
    setFormModal(false)
    resetForm()
  }

  const handleDelete = () => {
    if (!deleteConfirm) return
    setRoles(prev => prev.filter(r => r.id !== deleteConfirm.id))
    setDeleteConfirm(null)
  }

  // ── Matrix helpers ──
  const toggleMatrixPerm = (roleId, permKey) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId || r.isLocked) return r
      const perms = getPerms(r)
      const newPerms = perms.includes(permKey)
        ? perms.filter(p => p !== permKey)
        : [...perms, permKey]
      return { ...r, permissions: newPerms }
    }))
  }

  const toggleMatrixGroup = (roleId, groupKey) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId || r.isLocked) return r
      const groupPerms = PERM_GROUPS.find(g => g.key === groupKey)?.perms.map(p => p.key) || []
      const perms = getPerms(r)
      const allChecked = groupPerms.every(p => perms.includes(p))
      const newPerms = allChecked
        ? perms.filter(p => !groupPerms.includes(p))
        : [...new Set([...perms, ...groupPerms])]
      return { ...r, permissions: newPerms }
    }))
  }


  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */
  return (
    <div className="space-y-5">

      {/* ── Page Header ── */}
      <PageHeader
        title="Roles & Permissions"
        subtitle="Define access levels for Sangh and Trust users"
        breadcrumbs={[{ label: 'Home' }, { label: 'Masters' }, { label: 'Roles & Permissions' }]}
        action={<Button size="sm" icon={Plus} onClick={openAdd}>Add Role</Button>}
      />

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-1 bg-slate-100/80 rounded-xl p-1 w-fit">
        {[
          { key: 'roles', label: 'Roles List', icon: Shield },
          { key: 'matrix', label: 'Permission Matrix', icon: ShieldCheck },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" strokeWidth={activeTab === tab.key ? 2.5 : 2} />
            {tab.label}
          </button>
        ))}
      </div>


      {/* ═════════════════════════════════════════════
         TAB 1: ROLES LIST
         ═════════════════════════════════════════════ */}
      {activeTab === 'roles' && (
        <div className="space-y-4">

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <SearchBar value={search} onChange={setSearch} placeholder="Search roles..." className="max-w-xs" />
            <div className="flex items-center gap-1.5">
              {['All', 'System', 'Sangh', 'Trust'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-200 ${
                    filterType === type
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                      : 'bg-white text-slate-500 border border-slate-150 hover:border-emerald-200 hover:text-emerald-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="text-center px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Users</th>
                    <th className="text-left px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Permissions</th>
                    <th className="text-center px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <Shield className="w-10 h-10 text-slate-200 mx-auto mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-slate-400">No roles found</p>
                      </td>
                    </tr>
                  ) : filtered.map((role, idx) => {
                    const count = getPermCount(role)
                    const isAll = role.permissions === 'all'
                    return (
                      <tr
                        key={role.id}
                        className={`border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50/50 ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}
                        style={{ animation: `fadeInUp 0.35s ease-out ${idx * 0.04}s both` }}
                      >
                        {/* Role Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              role.isLocked ? 'bg-gradient-to-br from-teal-400 to-emerald-500' : 'bg-slate-100'
                            }`}>
                              {(() => {
                                const Icon = TYPE_ICON[role.type] || Shield
                                return <Icon className={`w-4 h-4 ${role.isLocked ? 'text-white' : 'text-slate-500'}`} strokeWidth={2} />
                              })()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-[14px] font-bold text-slate-800">{role.name}</p>
                                {role.isLocked && <Lock className="w-3 h-3 text-amber-500" strokeWidth={2.5} />}
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5 line-clamp-1 max-w-[260px]">{role.description}</p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-4"><TypeBadge type={role.type} /></td>

                        {/* Users */}
                        <td className="px-4 py-4 text-center">
                          <span className="text-[14px] font-bold text-slate-700">{role.usersCount}</span>
                        </td>

                        {/* Permissions */}
                        <td className="px-4 py-4">
                          {isAll ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700">
                              <ShieldCheck className="w-3 h-3" strokeWidth={2.5} />
                              Full Access
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                              {count}/{TOTAL_PERMS} Perms
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center"><StatusBadge status={role.status} /></td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-0.5">
                            <button onClick={() => openView(role)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors" title="View Permissions">
                              <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                            </button>
                            {!role.isLocked && (
                              <>
                                <button onClick={() => openEdit(role)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors" title="Edit Role">
                                  <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                </button>
                                <button onClick={() => setDeleteConfirm(role)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors" title="Delete Role">
                                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ═════════════════════════════════════════════
         TAB 2: PERMISSION MATRIX
         ═════════════════════════════════════════════ */}
      {activeTab === 'matrix' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2.5} />
            <p className="text-[12px] font-medium text-emerald-700">
              Click any checkbox to toggle permission. <span className="text-emerald-500">Locked roles (Super Admin) cannot be modified.</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="sticky left-0 z-20 bg-slate-50/50 text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider min-w-[200px] border-r border-slate-100">
                      Module / Action
                    </th>
                    {roles.map(role => (
                      <th key={role.id} className="text-center px-3 py-3 min-w-[120px]">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{role.name}</span>
                          <TypeBadge type={role.type} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERM_GROUPS.map((group, gIdx) => (
                    <React.Fragment key={group.key}>
                      {/* Module Header */}
                      <tr className={`border-b border-slate-100 ${gIdx % 2 === 0 ? 'bg-slate-50/40' : ''}`}>
                        <td colSpan={roles.length + 1} className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <group.icon className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                            <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">{group.label}</span>
                            <span className="text-[10px] font-medium text-slate-300">({group.perms.length})</span>
                          </div>
                        </td>
                      </tr>
                      {/* Permission Rows */}
                      {group.perms.map(perm => (
                        <tr key={perm.key} className="border-b border-slate-50 hover:bg-emerald-50/20 transition-colors">
                          <td className="sticky left-0 z-10 bg-white hover:bg-emerald-50/20 px-4 py-2.5 text-[13px] font-medium text-slate-600 border-r border-slate-100 pl-8">
                            {perm.label}
                          </td>
                          {roles.map(role => {
                            const checked = hasPerm(role, perm.key)
                            const locked = role.isLocked
                            return (
                              <td key={role.id} className="px-3 py-2.5 text-center">
                                <div className="flex justify-center">
                                  <PermCheckbox
                                    checked={checked}
                                    onChange={() => !locked && toggleMatrixPerm(role.id, perm.key)}
                                  />
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* ═════════════════════════════════════════════
         MODAL: ADD / EDIT ROLE
         ═════════════════════════════════════════════ */}
      <Modal
        isOpen={formModal}
        onClose={() => { setFormModal(false); resetForm() }}
        title={editingRole ? 'Edit Role' : 'Add New Role'}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setFormModal(false); resetForm() }}>Cancel</Button>
            <Button onClick={handleSave}>{editingRole ? 'Update Role' : 'Create Role'}</Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Role Name"
              placeholder="e.g. Sangh Vice President"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">Role Type</label>
              <select
                value={form.type}
                onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                disabled={!!editingRole}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all"
              >
                <option value="System">System</option>
                <option value="Sangh">Sangh</option>
                <option value="Trust">Trust</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Input
                label="Description"
                placeholder="Brief description of this role's responsibilities"
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          {/* Clone From */}
          {!editingRole && (
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">
                <Copy className="w-3 h-3 inline mr-1" strokeWidth={2} />
                Clone Permissions From
              </label>
              <select
                value={form.cloneFrom}
                onChange={e => handleClone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              >
                <option value="">— Start from scratch —</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({getPermCount(r)} perms)</option>
                ))}
              </select>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Permission Assignment</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-600">{form.permissions.length}</span>
              <span className="text-[11px] text-slate-400">/ {TOTAL_PERMS} selected</span>
            </div>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Permission Groups */}
          <div className="max-h-[42vh] overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            {PERM_GROUPS.map(group => {
              const groupPermKeys = group.perms.map(p => p.key)
              const allChecked = groupPermKeys.every(p => form.permissions.includes(p))
              const someChecked = groupPermKeys.some(p => form.permissions.includes(p))
              const indeterminate = someChecked && !allChecked

              return (
                <div key={group.key} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50/60">
                    <PermCheckbox
                      checked={allChecked}
                      indeterminate={indeterminate}
                      onChange={() => toggleAllFormGroup(group.key)}
                    />
                    <group.icon className="w-4 h-4 text-slate-400" strokeWidth={2} />
                    <span className="text-[13px] font-bold text-slate-700 flex-1">{group.label}</span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {groupPermKeys.filter(p => form.permissions.includes(p)).length}/{groupPermKeys.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 px-4 py-3">
                    {group.perms.map(perm => (
                      <label key={perm.key} className="flex items-center gap-2 cursor-pointer group/perm">
                        <PermCheckbox
                          checked={form.permissions.includes(perm.key)}
                          onChange={() => toggleFormPerm(perm.key)}
                        />
                        <span className={`text-[12px] font-medium transition-colors ${
                          form.permissions.includes(perm.key) ? 'text-emerald-700' : 'text-slate-500 group-hover/perm:text-slate-700'
                        }`}>
                          {perm.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>


      {/* ═════════════════════════════════════════════
         MODAL: VIEW ROLE PERMISSIONS
         ═════════════════════════════════════════════ */}
      {viewRole && (
        <Modal
          isOpen={!!viewRole}
          onClose={() => setViewRole(null)}
          title={`${viewRole.name} — Permissions`}
          size="lg"
          footer={<Button variant="secondary" onClick={() => setViewRole(null)}>Close</Button>}
        >
          <div className="space-y-4">
            {/* Role Info Card */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                viewRole.isLocked ? 'bg-gradient-to-br from-teal-400 to-emerald-500' : 'bg-white border border-slate-200'
              }`}>
                {(() => {
                  const Icon = TYPE_ICON[viewRole.type] || Shield
                  return <Icon className={`w-5 h-5 ${viewRole.isLocked ? 'text-white' : 'text-slate-500'}`} strokeWidth={2} />
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-slate-800">{viewRole.name}</p>
                  <TypeBadge type={viewRole.type} />
                </div>
                <p className="text-[12px] text-slate-400 mt-0.5">{viewRole.description}</p>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-extrabold text-emerald-600">{getPermCount(viewRole)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">of {TOTAL_PERMS}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-slate-500">Access Level</span>
                <span className="text-emerald-600">{Math.round((getPermCount(viewRole) / TOTAL_PERMS) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(getPermCount(viewRole) / TOTAL_PERMS) * 100}%` }}
                />
              </div>
            </div>

            {/* Permissions by Group */}
            <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
              {PERM_GROUPS.map(group => {
                const groupPermKeys = group.perms.map(p => p.key)
                const granted = groupPermKeys.filter(p => hasPerm(viewRole, p))
                const allGranted = granted.length === groupPermKeys.length

                return (
                  <div key={group.key} className={`border rounded-xl overflow-hidden ${allGranted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2.5 px-4 py-2.5">
                      <group.icon className={`w-4 h-4 ${allGranted ? 'text-emerald-600' : 'text-slate-400'}`} strokeWidth={2} />
                      <span className="text-[13px] font-bold text-slate-700 flex-1">{group.label}</span>
                      {allGranted ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">All Granted</span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">{granted.length}/{groupPermKeys.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-4 pb-3">
                      {group.perms.map(perm => {
                        const granted = hasPerm(viewRole, perm.key)
                        return (
                          <span
                            key={perm.key}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                              granted
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-400 line-through'
                            }`}
                          >
                            {granted ? <Check className="w-3 h-3 inline mr-0.5 -mt-0.5" strokeWidth={3} /> : <Minus className="w-3 h-3 inline mr-0.5 -mt-0.5" strokeWidth={2} />}
                            {perm.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Modal>
      )}


      {/* ═════════════════════════════════════════════
         MODAL: DELETE CONFIRMATION
         ═════════════════════════════════════════════ */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Role"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        {deleteConfirm && (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-rose-500" strokeWidth={2} />
            </div>
            <p className="text-[14px] font-semibold text-slate-700 mb-1">
              Delete "{deleteConfirm.name}"?
            </p>
            <p className="text-[12px] text-slate-400">
              This role is assigned to <span className="font-bold text-slate-600">{deleteConfirm.usersCount} users</span>.
              They will lose these permissions.
            </p>
          </div>
        )}
      </Modal>


      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}