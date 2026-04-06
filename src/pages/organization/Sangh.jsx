import { useState } from 'react'
import { Users, Search, Plus, Edit2, Trash2, MapPin, Building, Filter, Check, X } from 'lucide-react'

export default function Sangh() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const [sanghList] = useState([
    { id: 1, name: 'Palitana Jain Sangh', city: 'Palitana', state: 'Gujarat', activeTrustees: 5, status: 'Active' },
    { id: 2, name: 'Ahmedabad Jain Sangh', city: 'Ahmedabad', state: 'Gujarat', activeTrustees: 12, status: 'Active' },
    { id: 3, name: 'Ranakpur Sangh', city: 'Ranakpur', state: 'Rajasthan', activeTrustees: 2, status: 'Inactive' }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sangh Management</h1>
          <p className="text-sm text-slate-500">Manage all local Sanghs and their locations</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add New Sangh
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search Sangh..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>
        <button className="w-full md:w-auto justify-center border border-slate-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
          <Filter className="w-4 h-4 text-slate-500" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Sr. No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Sangh Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Trustees</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sanghList.map((sangh, index) => (
                <tr key={sangh.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600"><Building className="w-4 h-4" /></div>
                      <span className="text-sm font-semibold text-slate-700">{sangh.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sangh.city}, {sangh.state}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{sangh.activeTrustees} Active</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${sangh.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {sangh.status === 'Active' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {sangh.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}