import { useMemo, useState } from 'react'
import { Building2, Users, UserCog, BookOpen, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import SanghCard from '../../components/organization/SanghCard'
import { INITIAL_SANGHS, INITIAL_TRUSTS, getTrustName } from './orgData'

export default function Sangh() {
  const [search, setSearch] = useState('')
  const sanghs = useMemo(function() {
    try {
      const stored = localStorage.getItem('org_sanghs')
      return stored ? JSON.parse(stored) : INITIAL_SANGHS
    } catch {
      return INITIAL_SANGHS
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
      isEmpty={!filteredSanghs.length}
      emptyState={<EmptyState message="No sangh records found" description="Try a wider search or create a sangh under the selected trust." icon={Users} action={<Button variant="secondary" size="sm" icon={Plus}>Add Sangh</Button>} />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSanghs.map(function(sangh, index) {
          return <SanghCard key={sangh.id} sangh={sangh} trustName={getTrustName(sangh.trustId, trusts)} memberCount={sangh.memberCount} index={index} />
        })}
      </div>
    </CommonPageLayout>
  )
}

