import { useEffect, useMemo, useState } from 'react'
import { Building2, Users, UserCog, BookOpen, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import CommonPageLayout from '../../components/ui/CommonPageLayout'
import SanghCard from '../../components/organization/SanghCard'
import { INITIAL_SANGHS, INITIAL_TRUSTS, getTrustName } from './orgData'
import { orgService } from '../../services/apiService'

export default function Sangh() {
  const [search, setSearch] = useState('')
  const [sanghs, setSanghs] = useState([])
  const [trusts, setTrusts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sanghData, trustData] = await Promise.all([
        orgService.getSanghs(),
        orgService.getTrusts()
      ])
      setSanghs(Array.isArray(sanghData) ? sanghData : [])
      setTrusts(Array.isArray(trustData) ? trustData : [])
    } catch (error) {
      console.error('Failed to fetch sangh data:', error)
      setSanghs(INITIAL_SANGHS)
      setTrusts(INITIAL_TRUSTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredSanghs = useMemo(function() {
    return sanghs.filter(function(sangh) {
      const query = search.toLowerCase()
      return !query || [sangh.name, sangh.type, sangh.city, sangh.area, getTrustName(sangh.trustId, trusts)].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search, sanghs, trusts])

  const stats = useMemo(function() {
    const active = sanghs.filter(function(sangh) { return sangh.status === 'Active' }).length
    const members = sanghs.reduce(function(sum, sangh) { return sum + (sangh.memberCount || 0) }, 0)
    const pathshalas = sanghs.reduce(function(sum, sangh) { return sum + (sangh.pathshalaCount || 0) }, 0)
    return [
      { title: 'Total Sanghs', value: sanghs.length, icon: Building2, color: 'teal' },
      { title: 'Active Sanghs', value: active, icon: Users, color: 'emerald' },
      { title: 'Members', value: members, icon: UserCog, color: 'sky' },
      { title: 'Pathshala Units', value: pathshalas, icon: BookOpen, color: 'amber' },
    ]
  }, [sanghs])

  return (
    <CommonPageLayout
      title="Sangh Management"
      subtitle="Manage sanghs, local units, and operational counts under each trust."
      breadcrumbs={[{ label: 'Organization' }, { label: 'Sangh' }]}
      action={<Button icon={Plus}>Add Sangh</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search sangh, type, city, area, or trust..."
      isEmpty={!loading && !filteredSanghs.length}
      emptyState={<EmptyState message="No sangh records found" description="Try a wider search or create a sangh under the selected trust." icon={Users} action={<Button variant="secondary" size="sm" icon={Plus}>Add Sangh</Button>} />}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-[24px] bg-white border border-slate-100 animate-pulse p-6 flex flex-col space-y-4">
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-3 bg-slate-50 rounded w-1/3" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="h-12 bg-slate-50 rounded-2xl" />
                <div className="h-12 bg-slate-50 rounded-2xl" />
              </div>
              <div className="h-10 bg-slate-50 rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSanghs.map(function(sangh, index) {
            return <SanghCard key={sangh.id} sangh={sangh} trustName={getTrustName(sangh.trustId, trusts)} memberCount={sangh.memberCount} index={index} />
          })}
        </div>
      )}
    </CommonPageLayout>
  )
}

