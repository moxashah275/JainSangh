import { useEffect, useMemo, useState } from 'react'
import { Landmark, Building2, UserCog, Plus, Loader2 } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import TrustCard from '../../components/organization/TrustCard'
import { INITIAL_TRUSTS } from './orgData'
import { orgService } from '../../services/apiService'

export default function Trust() {
  const [search, setSearch] = useState('')
  const [trusts, setTrusts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTrusts = async () => {
    setLoading(true)
    try {
      const data = await orgService.getTrusts()
      setTrusts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch trusts:', error)
      // Fallback to initial trusts if API fails (optional, based on UX preference)
      setTrusts(INITIAL_TRUSTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrusts()
  }, [])

  const filteredTrusts = useMemo(function() {
    return trusts.filter(function(trust) {
      const query = search.toLowerCase()
      return !query || [trust.name, trust.address, trust.admin, trust.code].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [search, trusts])

  const stats = useMemo(function() {
    const active = trusts.filter(function(trust) { return trust.status === 'Active' }).length
    const totalSanghs = trusts.reduce(function(sum, trust) { return sum + (trust.sanghCount || 0) }, 0)
    const totalManagers = trusts.reduce(function(sum, trust) { return sum + (trust.managerCount || 0) }, 0)
    return [
      { title: 'Total Trusts', value: trusts.length, icon: Landmark, color: 'teal' },
      { title: 'Active Trusts', value: active, icon: Building2, color: 'emerald' },
      { title: 'Managed Sanghs', value: totalSanghs, icon: Building2, color: 'sky' },
      { title: 'Managers', value: totalManagers, icon: UserCog, color: 'amber' },
    ]
  }, [trusts])

  return (
    <CommonPageLayout
      title="Trust Management"
      subtitle="Manage the trust layer above sanghs for Sathandji Kalyanji Sangh, Palitana."
      breadcrumbs={[{ label: 'Organization' }, { label: 'Trust' }]}
      action={<Button icon={Plus}>Add Trust</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search trust, admin, code, or address..."
      isEmpty={!loading && !filteredTrusts.length}
      emptyState={<EmptyState message="No trust records found" description="Try a different search or add a new trust record." icon={Landmark} action={<Button variant="secondary" size="sm" icon={Plus}>Add Trust</Button>} />}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-[24px] bg-white border border-slate-100 animate-pulse flex flex-col p-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <div className="h-8 bg-slate-50 rounded-xl" />
                <div className="h-8 bg-slate-50 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTrusts.map(function(trust, index) {
            return <TrustCard key={trust.id} trust={trust} index={index} />
          })}
        </div>
      )}
    </CommonPageLayout>
  )
}

