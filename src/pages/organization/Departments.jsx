import { useMemo, useState } from 'react'
import { Building2, Users, Landmark, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import DepartmentCard from '../../components/organization/DepartmentCard'
import { INITIAL_DEPARTMENTS, INITIAL_TRUSTS, INITIAL_SANGHS, getTrustName, getSanghName } from './orgData'

export default function Departments() {
  const [search, setSearch] = useState('')
  const departments = useMemo(function() {
    try {
      const stored = localStorage.getItem('org_departments')
      return stored ? JSON.parse(stored) : INITIAL_DEPARTMENTS
    } catch {
      return INITIAL_DEPARTMENTS
    }
  }, [])

  const trusts = useMemo(function() {
    try {
      const stored = localStorage.getItem('org_trusts')
      return stored ? JSON.parse(stored) : INITIAL_TRUSTS
    } catch {
      return INITIAL_TRUSTS
    }
  }, [])

  const sanghs = useMemo(function() {
    try {
      const stored = localStorage.getItem('org_sanghs')
      return stored ? JSON.parse(stored) : INITIAL_SANGHS
    } catch {
      return INITIAL_SANGHS
    }
  }, [])

  const filteredDepartments = useMemo(function() {
    return departments.filter(function(department) {
      const query = search.toLowerCase()
      return !query || [department.name, department.head, department.description, getTrustName(department.trustId, trusts), getSanghName(department.sanghId, sanghs)].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [departments, sanghs, search, trusts])

  const stats = useMemo(function() {
    const active = departments.filter(function(department) { return department.status === 'Active' }).length
    const members = departments.reduce(function(sum, department) { return sum + (department.memberCount || 0) }, 0)
    const connectedSanghs = new Set(departments.map(function(department) { return department.sanghId })).size
    return [
      { title: 'Departments', value: departments.length, icon: Building2, color: 'teal' },
      { title: 'Active Teams', value: active, icon: Users, color: 'emerald' },
      { title: 'Department Members', value: members, icon: Users, color: 'sky' },
      { title: 'Connected Sanghs', value: connectedSanghs, icon: Landmark, color: 'amber' },
    ]
  }, [departments])

  return (
    <CommonPageLayout
      title="Departments"
      subtitle="Track managers, accounts, committee, derasar, and pathshala departments within sanghs."
      breadcrumbs={[{ label: 'Organization' }, { label: 'Departments' }]}
      action={<Button icon={Plus}>Add Department</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search department, head, trust, sangh, or description..."
      isEmpty={!filteredDepartments.length}
      emptyState={<EmptyState message="No departments found" description="Create a department to organize sangh operations cleanly." icon={Building2} action={<Button variant="secondary" size="sm" icon={Plus}>Add Department</Button>} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDepartments.map(function(department, index) {
          return <DepartmentCard key={department.id} dept={department} trustName={`${getTrustName(department.trustId, trusts)} - ${getSanghName(department.sanghId, sanghs)}`} memberCount={department.memberCount} index={index} />
        })}
      </div>
    </CommonPageLayout>
  )
}

