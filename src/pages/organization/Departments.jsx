import { useEffect, useMemo, useState } from 'react'
import { Building2, Users, Landmark, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonPageLayout from '../../components/ui/CommonPageLayout'
import DepartmentCard from '../../components/organization/DepartmentCard'
import { INITIAL_DEPARTMENTS, INITIAL_TRUSTS, INITIAL_SANGHS, getTrustName, getSanghName } from './orgData'
import { orgService } from '../../services/apiService'

export default function Departments() {
  const [search, setSearch] = useState('')
  const [departments, setDepartments] = useState([])
  const [trusts, setTrusts] = useState([])
  const [sanghs, setSanghs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [depData, trustData, sanghData] = await Promise.all([
        orgService.getDepartments(),
        orgService.getTrusts(),
        orgService.getSanghs()
      ])
      setDepartments(Array.isArray(depData) ? depData : [])
      setTrusts(Array.isArray(trustData) ? trustData : [])
      setSanghs(Array.isArray(sanghData) ? sanghData : [])
    } catch (error) {
      console.error('Failed to fetch department data:', error)
      setDepartments(INITIAL_DEPARTMENTS)
      setTrusts(INITIAL_TRUSTS)
      setSanghs(INITIAL_SANGHS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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
      isEmpty={!loading && !filteredDepartments.length}
      emptyState={<EmptyState message="No departments found" description="Create a department to organize sangh operations cleanly." icon={Building2} action={<Button variant="secondary" size="sm" icon={Plus}>Add Department</Button>} />}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-[24px] bg-white border border-slate-100 animate-pulse p-6 flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="w-6 h-6 bg-slate-50 rounded-full" />
              </div>
              <div className="h-12 bg-slate-50 rounded-2xl w-full" />
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
              </div>
              <div className="h-10 bg-slate-50 rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDepartments.map(function(department, index) {
            return <DepartmentCard key={department.id} dept={department} trustName={`${getTrustName(department.trustId, trusts)} - ${getSanghName(department.sanghId, sanghs)}`} memberCount={department.memberCount} index={index} />
          })}
        </div>
      )}
    </CommonPageLayout>
  )
}

