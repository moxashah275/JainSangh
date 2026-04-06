import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import SearchBar from '../../components/common/SearchBar'
import EmptyState from '../../components/common/EmptyState'
import UserCard from '../../components/users/UserCard'
import { INITIAL_USERS, INITIAL_USER_DOCS, getRole, getDocCount } from '../users/userData'
import { INITIAL_TRUSTS, INITIAL_SANGHS } from '../organization/orgData'
import { INITIAL_ROLES } from '../RolesAndPermissions/roleData'

export default function CommitteeMembers() {
  var navigate = useNavigate()
  var usersState = useState(function() { try { var s = localStorage.getItem('users_full'); return s ? JSON.parse(s) : INITIAL_USERS } catch(e) { return INITIAL_USERS } })
  var users = usersState[0]
  var docsState = useState(function() { try { var s = localStorage.getItem('user_docs'); return s ? JSON.parse(s) : INITIAL_USER_DOCS } catch(e) { return INITIAL_USER_DOCS } })
  var docs = docsState[0]
  var trusts = useState(function() { try { var s = localStorage.getItem('org_trusts'); return s ? JSON.parse(s) : INITIAL_TRUSTS } catch(e) { return INITIAL_TRUSTS } })[0]
  var sanghs = useState(function() { try { var s = localStorage.getItem('org_sanghs'); return s ? JSON.parse(s) : INITIAL_SANGHS } catch(e) { return INITIAL_SANGHS } })[0]
  var roles = useState(function() { try { var s = localStorage.getItem('rp_roles'); return s ? JSON.parse(s) : INITIAL_ROLES } catch(e) { return INITIAL_ROLES } })[0]

  var committeeRole = useMemo(function() { return (roles || []).find(function(r) { return r.name === 'Committee Member' }) }, [roles])
  var searchState = useState(''); var search = searchState[0]; var setSearch = searchState[1]

  var filtered = useMemo(function() {
    if (!committeeRole) return []
    return users.filter(function(u) { return u.roleId === committeeRole.id && (!search || u.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) })
  }, [users, committeeRole, search])

  var activeCount = filtered.filter(function(u) { return u.status === 'Active' }).length

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-4 pb-6 bg-[#f8fafc] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-5">
        <PageHeader title="Committee Members" subtitle="View and manage committee members" action={<Button icon={Plus} onClick={function() { navigate('/users/add') }}>Add Member</Button>} />
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard title="Total Members" value={filtered.length} icon={Users} color="teal" />
          <StatCard title="Active Members" value={activeCount} icon={Users} color="emerald" />
        </div>
        <div className="relative w-full sm:w-72"><SearchBar value={search} onChange={setSearch} placeholder="Search members..." /></div>
        {filtered.length === 0 ? <EmptyState message="No committee members found" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(function(user, i) {
              return <UserCard key={user.id} user={user} role={getRole(user.roleId)} trust={trusts.find(function(t) { return t.id === user.trustId })} sangh={sanghs.find(function(s) { return s.id === user.sanghId })} docCount={getDocCount(user.id, docs)} onView={function() { navigate('/users/' + user.id) }} onEdit={function() { navigate('/users/edit/' + user.id) }} index={i} />
            })}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }" }} />
    </div>
  )
}