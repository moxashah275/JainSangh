import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ShieldCheck, Building2, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import UserCard from '../../components/users/UserCard'
import { INITIAL_USERS, INITIAL_USER_DOCS, getDocCount } from '../users/userData'
import { INITIAL_ROLES } from '../RolesAndPermissions/RoleData'

export default function CommitteeMembers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [users] = useState(function() {
    try {
      const stored = sessionStorage.getItem('users_full')
      return stored ? JSON.parse(stored) : INITIAL_USERS
    } catch {
      return INITIAL_USERS
    }
  })
  const [docs] = useState(function() {
    try {
      const stored = sessionStorage.getItem('user_docs')
      return stored ? JSON.parse(stored) : INITIAL_USER_DOCS
    } catch {
      return INITIAL_USER_DOCS
    }
  })
  const [roles] = useState(function() {
    try {
      const stored = sessionStorage.getItem('rp_roles')
      return stored ? JSON.parse(stored) : INITIAL_ROLES
    } catch {
      return INITIAL_ROLES
    }
  })

  const committeeMembers = useMemo(function() {
    return users.filter(function(user) {
      const query = search.toLowerCase()
      const isCommittee = user.committee === true
      const matchesSearch = !query || [user.name, user.committeeRole, user.notes].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
      return isCommittee && matchesSearch
    })
  }, [search, users])

  const stats = useMemo(function() {
    const active = committeeMembers.filter(function(user) { return user.status === 'Active' }).length
    const rolesCovered = new Set(committeeMembers.map(function(user) { return user.roleId })).size
    const sanghsCovered = new Set(committeeMembers.map(function(user) { return user.sanghId })).size
    return [
      { title: 'Committee Members', value: committeeMembers.length, icon: Users, color: 'teal' },
      { title: 'Active Members', value: active, icon: ShieldCheck, color: 'emerald' },
      { title: 'Role Levels', value: rolesCovered, icon: ShieldCheck, color: 'sky' },
      { title: 'Sanghs Covered', value: sanghsCovered, icon: Building2, color: 'amber' },
    ]
  }, [committeeMembers])

  return (
    <CommonPageLayout
      title="Committee Members"
      subtitle="View committee members across trust and sangh governance bodies."
      action={<Button icon={Plus} onClick={function() { navigate('/users') }}>Add Member</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search committee name, role, or notes..."
      isEmpty={!committeeMembers.length}
      emptyState={<EmptyState message="No committee members found" description="Assign committee members from the users list to see them here." icon={Users} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {committeeMembers.map(function(user, index) {
          const role = roles.find(function(item) { return item.id === user.roleId })
          return (
            <UserCard
              key={user.id}
              user={user}
              role={role}
              docCount={getDocCount(user.id, docs)}
              onView={function() { navigate('/users/' + user.id) }}
              onEdit={function() { navigate('/users/' + user.id) }}
              index={index}
            />
          )
        })}
      </div>
    </CommonPageLayout>
  )
}

