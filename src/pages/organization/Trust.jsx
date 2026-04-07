import { useMemo, useState } from 'react'
import { Landmark, Building2, UserCog, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import TrustCard from '../../components/organization/TrustCard'
import { INITIAL_TRUSTS } from './orgData'

export default function Trust() {
  const [search, setSearch] = useState('')
  const trusts = useMemo(function() {
    try {
      const stored = localStorage.getItem('org_trusts')
      return stored ? JSON.parse(stored) : INITIAL_TRUSTS
    } catch {
      return INITIAL_TRUSTS
    }
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
      isEmpty={!filteredTrusts.length}
      emptyState={<EmptyState message="No trust records found" description="Try a different search or add a new trust record." icon={Landmark} action={<Button variant="secondary" size="sm" icon={Plus}>Add Trust</Button>} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTrusts.map(function(trust, index) {
          return <TrustCard key={trust.id} trust={trust} index={index} />
        })}
      </div>
    </CommonPageLayout>
  )
}

