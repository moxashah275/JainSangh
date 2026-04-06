import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, UserCheck, UserX, AlertTriangle, ShieldCheck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import SearchBar from '../../components/common/SearchBar'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import ConfirmModal from '../../components/common/ConfirmModal'
import FilterBar from '../../components/common/FilterBar'
import Pagination from '../../components/common/Pagination'
import UserCard from '../../components/users/UserCard'
import UserForm from '../../components/users/UserForm'
import { INITIAL_USERS, INITIAL_USER_DOCS, INITIAL_ACTIVITIES, getRole, getDocCount, getStatusCounts } from './userData'
import { getCount } from '../RolesAndPermissions/roleData'
import { INITIAL_TRUSTS, INITIAL_SANGHS, INITIAL_DEPARTMENTS } from '../organization/orgData'

var PER_PAGE = 9

export default function UserList() {
  var navigate = useNavigate()
  var usersState = useState(function() { try { var s = localStorage.getItem('users_full'); return s ? JSON.parse(s) : INITIAL_USERS } catch(e) { return INITIAL_USERS } }); var users = usersState[0]; var setUsers = usersState[1]
  var docsState = useState(function() { try { var s = localStorage.getItem('user_docs'); return s ? JSON.parse(s) : INITIAL_USER_DOCS } catch(e) { return INITIAL_USER_DOCS } }); var docs = docsState[0]; var setDocs = docsState[1]
  var actsState = useState(function() { try { var s = localStorage.getItem('user_activities'); return s ? JSON.parse(s) : INITIAL_ACTIVITIES } catch(e) { return INITIAL_ACTIVITIES } }); var acts = actsState[0]; var setActs = actsState[1]
  var trusts = useState(function() { try { var s = localStorage.getItem('org_trusts'); return s ? JSON.parse(s) : INITIAL_TRUSTS } catch(e) { return INITIAL_TRUSTS } })[0]
  var sanghs = useState(function() { try { var s = localStorage.getItem('org_sanghs'); return s ? JSON.parse(s) : INITIAL_SANGHS } catch(e) { return INITIAL_SANGHS } })[0]
  var depts = useState(function() { try { var s = localStorage.getItem('org_departments'); return s ? JSON.parse(s) : INITIAL_DEPARTMENTS } catch(e) { return INITIAL_DEPARTMENTS } })[0]
  var roles = useState(function() { try { var s = localStorage.getItem('rp_roles'); return s ? JSON.parse(s) : null } catch(e) { return null } })[0]

  useEffect(function() { localStorage.setItem('users_full', JSON.stringify(users)) }, [users])
  useEffect(function() { localStorage.setItem('user_docs', JSON.stringify(docs)) }, [docs])
  useEffect(function() { localStorage.setItem('user_activities', JSON.stringify(acts)) }, [acts])

  
  var searchState = useState(''); var search = searchState[0]; var setSearch = searchState[1]
  var searchInputState = useState(''); var searchInput = searchInputState[0]; var setSearchInput = searchInputState[1]
  var filterState = useState({}); var filters = filterState[0]; var setFilters = filterState[1]
  var pageState = useState(1); var page = pageState[0]; var setPage = pageState[1]
  var showModalState = useState(false); var showModal = showModalState[0]; var setShowModal = showModalState[1]
  var editUserState = useState(null); var editingUser = editUserState[0]; var setEditingUser = editUserState[1]
  var delIdState = useState(null); var delId = delIdState[0]; var setDelId = delIdState[1]

  useEffect(function() { var t = setTimeout(function() { setSearch(searchInput) }, 300); return function() { clearTimeout(t) } }, [searchInput])
  useEffect(function() { setPage(1) }, [search, filters])

  var stats = useMemo(function() { return getStatusCounts(users) }, [users])
  var filtered = useMemo(function() {
    return users.filter(function(u) {
      if (search && u.name.toLowerCase().indexOf(search.toLowerCase()) === -1 && u.phone.indexOf(search) === -1) return false
      if (filters.role && u.roleId !== parseInt(filters.role)) return false
      if (filters.status && u.status !== filters.status) return false
      if (filters.trust && u.trustId !== parseInt(filters.trust)) return false
      if (filters.sangh && u.sanghId !== parseInt(filters.sangh)) return false
      return true
    })
  }, [users, search, filters])

  var sorted = useMemo(function() { return filtered.sort(function(a, b) { return a.name.localeCompare(b.name) }) }, [filtered])
  var totalPages = Math.ceil(sorted.length / PER_PAGE); var paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  var filterOptions = [
    { key: 'trust', placeholder: 'All Trusts', items: trusts.map(function(t) { return { value: t.id, label: t.name } }) },
    { key: 'sangh', placeholder: 'All Sanghs', items: sanghs.map(function(s) { return { value: s.id, label: s.name } }) },
    { key: 'role', placeholder: 'All Roles', items: (roles || []).map(function(r) { return { value: r.id, label: r.name } }) },
    { key: 'status', placeholder: 'All Status', items: ['Active', 'Inactive', 'Suspended'] }
  ]

  var goAdd = function() { setEditingUser(null); setShowModal(true) }
  var goEdit = function(user) { setEditingUser(user); setShowModal(true) } // Edit ફંક્શન મિસિંગ હતું
  var closeModal = function() { setShowModal(false); setEditingUser(null) }
  
  var handleSave = useCallback(function(data) {
    if (editingUser) {
      setUsers(function(p) { return p.map(function(u) { return u.id === editingUser.id ? Object.assign({}, u, data) : u }) })
      setActs(function(p) { return p.concat([{ id: Date.now(), userId: editingUser.id, action: 'updated', description: 'Profile updated', doneBy: 'Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }]) })
    } else {
      
      var newId = Math.max.apply(null, [0].concat(users.map(function(u) { return u.id }))) + 1
      setUsers(function(p) { return p.concat([Object.assign({}, data, { id: newId, joined: new Date().toISOString().split('T')[0], status: 'Active' })]) })
      setActs(function(p) { return p.concat([{ id: Date.now(), userId: newId, action: 'created', description: 'Created as ' + (getRole(data.roleId) || 'User'), doneBy: 'Admin', date: new Date().toISOString().slice(0, 16).replace('T', ' ') }]) })
    }
    closeModal()
  }, [editingUser, users])
  
  var handleDelete = useCallback(function() {
    setUsers(function(p) { return p.filter(function(u) { return u.id !== delId }) })
    setDocs(function(p) { return p.filter(function(d) { return d.userId !== delId }) })
    setActs(function(p) { return p.filter(function(a) { return a.userId !== delId }) })
    setDelId(null)
  }, [delId, users, docs, acts])

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-4 pb-6 bg-[#f8fafc] min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-[1480px] space-y-5">
        <PageHeader title="User Management" subtitle="Manage users, roles, and permissions" action={<Button icon={Plus} onClick={goAdd}>Add User</Button>} />

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Users" value={stats.Total} icon={Users} color="teal" />
          <StatCard title="Active" value={stats.Active} icon={UserCheck} color="emerald" />
          <StatCard title="Inactive" value={stats.Inactive} icon={UserX} color="rose" />
          <StatCard title="Suspended" value={stats.Suspended} icon={AlertTriangle} color="amber" />
          <StatCard title="Roles" value={(roles || []).length} icon={ShieldCheck} color="sky" />
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
          <div className="relative w-full sm:w-72"><SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search by name or phone..." /></div>
          <FilterBar filters={filters} options={filterOptions} onChange={function(key, val) { setFilters(Object.assign({}, filters, { [key]: val })) }} onClear={function() { setSearchInput(''); setFilters({}) }} />
        </div>

        {paginated.length === 0 ? (
          <EmptyState message="No users found" description={search ? 'Try different search' : 'Add your first user to get started'} action={<Button variant="secondary" size="sm" icon={Plus} onClick={goAdd}>Add User</Button>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(function(user, i) {
              return <UserCard key={user.id} user={user} role={getRole(user.roleId)} trust={trusts.find(function(t) { return t.id === user.trustId })} sangh={sanghs.find(function(s) { return s.id === user.sanghId })} docCount={getDocCount(user.id, docs)} onView={function() { navigate('/users/' + user.id) }} onEdit={function() { goEdit(user) }} onDelete={function() { setDelId(user.id) }} index={i} />
            })}
          </div>
        )}

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalItems={sorted.length} perPage={PER_PAGE} onChange={setPage} />}
      </div>

      <Modal isOpen={showModal} onClose={closeModal} title={editingUser ? 'Edit User' : 'Add New User'} size="lg">
        <UserForm user={editingUser} roles={roles || []} trusts={trusts} sanghs={sanghs} departments={depts} onSave={handleSave} onCancel={closeModal} />
      </Modal>

      <ConfirmModal isOpen={!!delId} onClose={function() { setDelId(null) }} onConfirm={handleDelete} title="Delete User?" message="This user and all associated data will be permanently removed." />
      
      <style dangerouslySetInnerHTML={{ __html: "@keyframes cardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }" }} />
    </div>
  )
}