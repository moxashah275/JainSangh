import { useMemo, useState } from 'react'
import { Shield, Users, Landmark, Lock } from 'lucide-react'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import CommonPageLayout from '../../components/ui/CommonPageLayout'
import RoleCard from '../../components/roles/RoleCard'
import { INITIAL_ROLES, INITIAL_USERS, PERM_GROUPS, getCount, getUserCount, hasPerm } from './RoleData'

const TYPE_LABELS = ['All', 'System', 'Trust', 'Sangh']
const RULE_MAP = {
  'Super Admin': 'Super Admin can do everything across multiple trusts and sanghs.',
  'Trust Admin': 'Trust Admin can manage only the assigned trust and its sanghs.',
  'Sangh Admin': 'Sangh Admin can manage only the assigned sangh.',
  Manager: 'Manager can add and edit records but cannot delete them.',
  'Accounts User': 'Accounts User can manage accounts and reports only.',
  'Normal User': 'Normal User can only view records.',
}

export default function RolesAndPermissionsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [roles] = useState(function() {
    try {
      const stored = sessionStorage.getItem('rp_roles')
      return stored ? JSON.parse(stored) : INITIAL_ROLES
    } catch {
      return INITIAL_ROLES
    }
  })
  const [users] = useState(function() {
    try {
      const stored = sessionStorage.getItem('users_full')
      return stored ? JSON.parse(stored) : INITIAL_USERS
    } catch {
      return INITIAL_USERS
    }
  })
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || null)

  const filteredRoles = useMemo(function() {
    return roles.filter(function(role) {
      const query = search.toLowerCase()
      const matchesSearch = !query || [role.name, role.type, role.description].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
      const matchesType = typeFilter === 'All' || role.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [roles, search, typeFilter])

  const selectedRole = filteredRoles.find(function(role) { return role.id === selectedRoleId }) || filteredRoles[0] || null

  const stats = useMemo(function() {
    const activeRoles = roles.filter(function(role) { return role.status === 'Active' }).length
    return [
      { title: 'Role Levels', value: roles.length, icon: Shield, color: 'teal' },
      { title: 'Active Roles', value: activeRoles, icon: Users, color: 'emerald' },
      { title: 'Permission Sections', value: PERM_GROUPS.length, icon: Lock, color: 'sky' },
      { title: 'Assigned Users', value: users.length, icon: Landmark, color: 'amber' },
    ]
  }, [roles, users])

  return (
    <CommonPageLayout
      title="Roles & Permissions"
      subtitle="Role levels, scope rules, and module permissions for the trust and sangh hierarchy."
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search role name, type, or description..."
      toolbar={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {TYPE_LABELS.map(function(label) {
            return (
              <button
                key={label}
                type="button"
                onClick={function() { setTypeFilter(label) }}
                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${typeFilter === label ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      }
      isEmpty={!filteredRoles.length}
      emptyState={<EmptyState message="No roles found" description="Try a different search or filter to view permission levels." icon={Shield} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredRoles.map(function(role, index) {
          return <RoleCard key={role.id} role={role} userCount={getUserCount(role.id, users)} permCount={getCount(role)} onClick={function() { setSelectedRoleId(role.id) }} index={index} />
        })}
      </div>

      {selectedRole ? (
        <div className="mt-5 space-y-5">
          <Card className="border-slate-100">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-[18px] font-bold text-slate-800">{selectedRole.name}</h2>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">{selectedRole.type}</span>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${selectedRole.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{selectedRole.status}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2 max-w-3xl">{selectedRole.description}</p>
                <p className="text-[13px] text-slate-600 mt-3 font-medium">{RULE_MAP[selectedRole.name] || 'Permission scope is defined by the selected sections below.'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 min-w-[240px]">
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Users</p>
                  <p className="text-[18px] font-bold text-slate-800 mt-1">{getUserCount(selectedRole.id, users)}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Permissions</p>
                  <p className="text-[18px] font-bold text-slate-800 mt-1">{getCount(selectedRole)}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {PERM_GROUPS.map(function(group) {
              return (
                <Card key={group.key} className="border-slate-100 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-800">{group.label}</h3>
                      <p className="text-[11px] text-slate-400 mt-1">{group.type} Scope</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 text-slate-500">{group.perms.length} Actions</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.perms.map(function(permission) {
                      const allowed = hasPerm(selectedRole, group.key + '_' + permission.toLowerCase().replace(/\s+/g, '_'))
                      return (
                        <span key={permission} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${allowed ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'}`}>
                          {permission}
                        </span>
                      )
                    })}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ) : null}
    </CommonPageLayout>
  )
}
