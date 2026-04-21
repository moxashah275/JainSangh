import { useState, useRef, useEffect } from 'react'
import { Plus, Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import LocationTable from './LocationTable'
import LocationStats from './LocationStats'

const TABS = ['Country', 'State', 'City', 'Area', 'Pincode']

export default function Location() {
  const [activeTab, setActiveTab] = useState('Country')
  const [search, setSearch] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [stats, setStats] = useState({ Country: 30, State: 30, City: 30, Area: 30, Pincode: 30 })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterValues, setFilterValues] = useState({
    countryId: 'all',
    stateId: 'all',
    cityId: 'all',
    areaId: 'all',
    status: 'all',
    pincodeNumber: ''
  })

  const tableRef = useRef(null)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAddClick = () => {
    if (tableRef.current) tableRef.current.openAddModal()
  }

  const handleReset = () => {
    setFilterValues({
      countryId: 'all',
      stateId: 'all',
      cityId: 'all',
      areaId: 'all',
      status: 'all',
      pincodeNumber: ''
    })
  }

  const totalPages = Math.ceil(totalEntries / itemsPerPage)
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries)

  return (
    <div className="-mx-5 lg:-mx-7 -mt-8 lg:-mt-10 bg-slate-50/40 min-h-screen font-sans pb-10">
      <div className="px-5 lg:px-7 pt-8 pb-4 space-y-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
          Location 
        </h1>

        <LocationStats statsData={stats} />

        {/* Tab Navigation Section */}
        <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm flex items-center w-full">
          {TABS.map((tab) => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); handleReset(); setCurrentPage(1); }} 
              className="py-4 text-xs font-bold flex-1 relative group outline-none"
            >
              {/* Background Logic: 
                  Active -> Emerald background
                  Inactive + Hover -> Slate background
              */}
              <div className={`absolute inset-x-1 inset-y-1 rounded-lg transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-emerald-50/60' 
                  : 'group-hover:bg-slate-50' 
              }`} />
              
              {/* Text Logic: 
                  Active -> Gradient Text
                  Inactive -> Slate-500
                  Inactive + Hover -> Black Text
              */}
              <span className={`relative tracking-widest transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent' 
                  : 'text-slate-500 group-hover:text-black' 
              }`}>
                {tab.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 lg:px-7 mt-2">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative">
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold shadow-sm transition-all ${isFilterOpen ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600'}`}
                >
                  <SlidersHorizontal size={16} strokeWidth={2.5} className="text-emerald-600" /> Filter
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] p-5 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
                    <div className="space-y-4">
                      {activeTab === 'State' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Country</label>
                          <div className="relative">
                            <select
                              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-500 transition-all"
                              value={filterValues.countryId}
                              onChange={(e) => setFilterValues({...filterValues, countryId: e.target.value })}
                            >
                              <option value="all">All Countries</option>
                              {tableRef.current?.getFilterOptions('Country').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {activeTab === 'City' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">State</label>
                          <div className="relative">
                            <select
                              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-500 transition-all"
                              value={filterValues.stateId}
                              onChange={(e) => setFilterValues({...filterValues, stateId: e.target.value })}
                            >
                              <option value="all">All States</option>
                              {tableRef.current?.getFilterOptions('State').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {activeTab === 'Area' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">City</label>
                          <div className="relative">
                            <select
                              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-500 transition-all"
                              value={filterValues.cityId}
                              onChange={(e) => setFilterValues({...filterValues, cityId: e.target.value })}
                            >
                              <option value="all">All Cities</option>
                              {tableRef.current?.getFilterOptions('City').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {activeTab === 'Pincode' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area</label>
                          <div className="relative">
                            <select
                              className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-emerald-500 transition-all"
                              value={filterValues.areaId}
                              onChange={(e) => setFilterValues({...filterValues, areaId: e.target.value })}
                            >
                              <option value="all">All Areas</option>
                              {tableRef.current?.getFilterOptions('Area').map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                        <div className="flex items-center gap-4">
                          {['all', 'active', 'inactive'].map((s) => (
                            <label key={s} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="radio"
                                name="status"
                                className="hidden"
                                checked={filterValues.status === s}
                                onChange={() => setFilterValues({...filterValues, status: s })}
                              />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${filterValues.status === s ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filterValues.status === s && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                              </div>
                              <span className={`text-xs font-bold capitalize ${filterValues.status === s ? 'text-slate-700' : 'text-slate-400'}`}>{s}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button onClick={handleReset} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Reset</button>
                        <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all">Filter</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleAddClick} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold px-5 py-2.5 transition-all shadow-md text-sm">
                <Plus size={16} strokeWidth={2.5} /> ADD {activeTab.toUpperCase()}
              </button>
            </div>
          </div>

          <LocationTable
            ref={tableRef}
            activeTab={activeTab}
            searchTerm={search}
            filterValues={filterValues}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setTotalEntries={setTotalEntries}
            onDataChange={(newStats) => setStats(newStats)}
          />

          <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3 pt-2 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Show</span>
              <select className="bg-white border border-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none font-semibold" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={5}>5</option><option value={10}>10</option><option value={30}>30</option>
              </select>
              <span className="text-xs font-semibold">entries</span>
            </div>
            <p className="text-xs font-medium">Showing {startEntry} to {endEntry} of {totalEntries} entries</p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 font-bold">‹</button>
              <button className="h-8 px-3.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs">{currentPage}</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 font-bold">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}