import { useMemo, useState } from 'react'
import { Globe2, MapPin, Building2, Plus } from 'lucide-react'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Card from '../../components/common/Card'
import CommonPageLayout from '../../components/common/CommonPageLayout'
import LocationCard from '../../components/organization/LocationCard'
import { INITIAL_LOCATIONS, LOCATION_LEVELS } from './orgData'

export default function Location() {
  const [search, setSearch] = useState('')
  const locations = useMemo(function() {
    try {
      const stored = localStorage.getItem('org_locations')
      return stored ? JSON.parse(stored) : INITIAL_LOCATIONS
    } catch {
      return INITIAL_LOCATIONS
    }
  }, [])

  const filteredLocations = useMemo(function() {
    return locations.filter(function(location) {
      const query = search.toLowerCase()
      return !query || [location.country, location.state, location.city, location.area, location.locality, location.pincode].some(function(value) {
        return String(value || '').toLowerCase().includes(query)
      })
    })
  }, [locations, search])

  const stats = useMemo(function() {
    const active = locations.filter(function(location) { return location.status === 'Active' }).length
    const trusts = locations.reduce(function(sum, location) { return sum + (location.trustCount || 0) }, 0)
    const sanghs = locations.reduce(function(sum, location) { return sum + (location.sanghCount || 0) }, 0)
    return [
      { title: 'Location Branches', value: locations.length, icon: Globe2, color: 'teal' },
      { title: 'Active Branches', value: active, icon: MapPin, color: 'emerald' },
      { title: 'Trust Coverage', value: trusts, icon: Building2, color: 'sky' },
      { title: 'Sangh Coverage', value: sanghs, icon: MapPin, color: 'amber' },
    ]
  }, [locations])

  return (
    <CommonPageLayout
      title="Location Management"
      subtitle="Maintain the organization hierarchy from country down to pincode."
      breadcrumbs={[{ label: 'Organization' }, { label: 'Location' }]}
      action={<Button icon={Plus}>Add Location</Button>}
      stats={stats}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search country, state, city, area, locality, or pincode..."
      isEmpty={!filteredLocations.length}
      emptyState={<EmptyState message="No locations found" description="Add a branch to start organizing trusts and sanghs by geography." icon={MapPin} action={<Button variant="secondary" size="sm" icon={Plus}>Add Location</Button>} />}
    >
      <Card className="border-slate-100">
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h3 className="text-[15px] font-bold text-slate-800">Location Structure</h3>
            <p className="text-[12px] text-slate-400 mt-1">Country ? State ? City ? Area ? Locality ? Pincode</p>
          </div>
          <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Palitana Example</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {LOCATION_LEVELS.map(function(level) {
            return (
              <div key={level.label} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{level.label}</p>
                <p className="text-[13px] font-semibold text-slate-700 mt-1">{level.value}</p>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
        {filteredLocations.map(function(location, index) {
          return <LocationCard key={location.id} location={location} sanghCount={location.sanghCount} index={index} />
        })}
      </div>
    </CommonPageLayout>
  )
}

