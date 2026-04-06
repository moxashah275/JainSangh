import { useState, useEffect } from 'react'
import { MapPin, Globe, Landmark, Building2, Hash, Search, Plus, Edit2, Trash2, Eye, Filter, X, ChevronDown, AlertTriangle } from 'lucide-react'

export default function Location() {
  const [activeTab, setActiveTab] = useState('Country')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  
  const getInitialData = (key, fallbackData) => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallbackData
  }

  
  const [countries, setCountries] = useState(() => getInitialData('countries', [
    { id: 1, name: 'India', code: 'IN', stateCount: 28, status: true },
    { id: 2, name: 'United States', code: 'USA', stateCount: 50, status: true },
    { id: 3, name: 'United Kingdom', code: 'UK', stateCount: 4, status: true },
    { id: 4, name: 'Canada', code: 'CAN', stateCount: 13, status: false },
    { id: 5, name: 'Australia', code: 'AUS', stateCount: 8, status: true }
  ]))

  const [states, setStates] = useState(() => getInitialData('states', [
    { id: 1, name: 'Gujarat', country: 'India', code: 'GJ', cityCount: 33, status: true },
    { id: 2, name: 'Maharashtra', country: 'India', code: 'MH', cityCount: 36, status: true },
    { id: 3, name: 'Rajasthan', country: 'India', code: 'RJ', cityCount: 33, status: false },
    { id: 4, name: 'California', country: 'United States', code: 'CA', cityCount: 48, status: true },
    { id: 5, name: 'Texas', country: 'United States', code: 'TX', cityCount: 25, status: true }
  ]))

  const [cities, setCities] = useState(() => getInitialData('cities', [
    { id: 1, name: 'Ahmedabad', state: 'Gujarat', country: 'India', areaCount: 12, status: true },
    { id: 2, name: 'Surat', state: 'Gujarat', country: 'India', areaCount: 8, status: true },
    { id: 3, name: 'Mumbai', state: 'Maharashtra', country: 'India', areaCount: 15, status: true },
    { id: 4, name: 'Los Angeles', state: 'California', country: 'United States', areaCount: 20, status: true },
    { id: 5, name: 'Houston', state: 'Texas', country: 'United States', areaCount: 10, status: false }
  ]))

  const [areas, setAreas] = useState(() => getInitialData('areas', [
    { id: 1, name: 'Paldi', city: 'Ahmedabad', state: 'Gujarat', pincode: '380007', status: true },
    { id: 2, name: 'Adajan', city: 'Surat', state: 'Gujarat', pincode: '395009', status: true },
    { id: 3, name: 'Andheri', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', status: true },
    { id: 4, name: 'Hollywood', city: 'Los Angeles', state: 'California', pincode: '90028', status: true },
    { id: 5, name: 'Downtown', city: 'Houston', state: 'Texas', pincode: '77002', status: false }
  ]))

  const [pincodes, setPincodes] = useState(() => getInitialData('pincodes', [
    { id: 1, code: '380007', city: 'Ahmedabad', area: 'Paldi', status: true },
    { id: 2, code: '395009', city: 'Surat', area: 'Adajan', status: true },
    { id: 3, code: '400053', city: 'Mumbai', area: 'Andheri', status: true },
    { id: 4, code: '90028', city: 'Los Angeles', area: 'Hollywood', status: true },
    { id: 5, code: '77002', city: 'Houston', area: 'Downtown', status: false }
  ]))

  
  useEffect(() => { localStorage.setItem('countries', JSON.stringify(countries)) }, [countries])
  useEffect(() => { localStorage.setItem('states', JSON.stringify(states)) }, [states])
  useEffect(() => { localStorage.setItem('cities', JSON.stringify(cities)) }, [cities])
  useEffect(() => { localStorage.setItem('areas', JSON.stringify(areas)) }, [areas])
  useEffect(() => { localStorage.setItem('pincodes', JSON.stringify(pincodes)) }, [pincodes])

  // Actions
  const toggleStatus = (id, data, setData) => {
    setData(data.map(item => item.id === id ? { ...item, status: !item.status } : item))
  }

  const triggerDelete = (item, setData) => {
    setItemToDelete({ item, setData })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      const { item, setData } = itemToDelete
      setData(prevData => prevData.filter(d => d.id !== item.id))
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
      // Toast નો કોડ અહીંથી કાઢી નાખ્યો છે
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const codeOrParent = formData.get('extra')

    if (!name) return
    const newItem = { id: Date.now(), status: true }

    if (activeTab === 'Country') setCountries([...countries, { ...newItem, name, code: codeOrParent || 'N/A', stateCount: 0 }])
    if (activeTab === 'State') setStates([...states, { ...newItem, name, country: codeOrParent || 'India', code: 'ST', cityCount: 0 }])
    if (activeTab === 'City') setCities([...cities, { ...newItem, name, state: codeOrParent || 'Gujarat', country: 'India', areaCount: 0 }])
    if (activeTab === 'Area') setAreas([...areas, { ...newItem, name, city: codeOrParent || 'Ahmedabad', state: 'Gujarat', pincode: '000000' }])
    if (activeTab === 'Pincode') setPincodes([...pincodes, { ...newItem, code: name, city: codeOrParent || 'Ahmedabad', area: 'Local' }])

    setIsAddModalOpen(false)
    e.target.reset()
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')

    if (!name || !currentItem) return
    const updater = (data) => data.map(item => item.id === currentItem.id ? { ...item, name: name, code: name } : item)

    if (activeTab === 'Country') setCountries(updater(countries))
    if (activeTab === 'State') setStates(updater(states))
    if (activeTab === 'City') setCities(updater(cities))
    if (activeTab === 'Area') setAreas(updater(areas))
    if (activeTab === 'Pincode') setPincodes(updater(pincodes))

    setIsEditModalOpen(false)
    setCurrentItem(null)
  }

  const getFilteredData = () => {
    let baseData = []; let setData = null
    if (activeTab === 'Country') { baseData = countries; setData = setCountries; }
    if (activeTab === 'State') { baseData = states; setData = setStates; }
    if (activeTab === 'City') { baseData = cities; setData = setCities; }
    if (activeTab === 'Area') { baseData = areas; setData = setAreas; }
    if (activeTab === 'Pincode') { baseData = pincodes; setData = setPincodes; }

    if (searchQuery.length >= 3) {
      const filtered = baseData.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      return { data: filtered, setData, originalData: baseData }
    }
    return { data: baseData, setData, originalData: baseData }
  }

  const { data: currentData, setData: currentSetData, originalData } = getFilteredData()

  const getStats = (dataArray) => {
    const total = dataArray.length
    const active = dataArray.filter(item => item.status).length
    const inactive = total - active
    return { total, active, inactive }
  }

  const dropdownOptions = [
    { name: 'Country', icon: Globe, stats: getStats(countries) },
    { name: 'State', icon: Landmark, stats: getStats(states) },
    { name: 'City', icon: Building2, stats: getStats(cities) },
    { name: 'Area', icon: MapPin, stats: getStats(areas) },
    { name: 'Pincode', icon: Hash, stats: getStats(pincodes) }
  ]

  const currentStats = dropdownOptions.find(opt => opt.name === activeTab).stats

  return (
    <div className="relative space-y-6 w-full min-h-[calc(100vh-2rem)] flex flex-col p-2">
      
      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-emerald-600">Location Management</h1>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">Total {activeTab}s</p>
          </div>
          <p className="text-2xl font-bold text-slate-800">{currentStats.total}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm font-medium text-slate-500">Active</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{currentStats.active}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-slate-500">Inactive</p>
          </div>
          <p className="text-2xl font-bold text-slate-600">{currentStats.inactive}</p>
        </div>
      </div>

      {/* Dropdown & Actions Control */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto pl-2">
          <label className="text-sm font-semibold text-slate-600 whitespace-nowrap">Select View:</label>
          <div className="relative w-full md:w-56">
            <select 
              value={activeTab} 
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:bg-white appearance-none cursor-pointer transition-colors"
            >
              {dropdownOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>{opt.name} Management</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="border border-slate-200 bg-white px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Filter className="w-4 h-4 text-slate-500" /> Filter
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-all">
              <Plus className="w-4 h-4" /> Add New
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse h-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600">
                
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Sr. No</th>
                {activeTab === 'Country' && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Country Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Country Code</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">State Count</th>
                  </>
                )}
                {activeTab === 'State' && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">State Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Country Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">State Code</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">City Count</th>
                  </>
                )}
                {activeTab === 'City' && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">City Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">State Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Area Count</th>
                  </>
                )}
                {activeTab === 'Area' && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Area Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">City Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Pincode</th>
                  </>
                )}
                {activeTab === 'Pincode' && (
                  <>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Pincode</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">City Name</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Area Name</th>
                  </>
                )}
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium text-center">{index + 1}</td>
                  
                  {activeTab === 'Country' && (
                    <>
                      
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-center">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.stateCount}</td>
                    </>
                  )}
                  {activeTab === 'State' && (
                    <>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-center">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.country}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.cityCount}</td>
                    </>
                  )}
                  {activeTab === 'City' && (
                    <>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-center">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.state}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.areaCount}</td>
                    </>
                  )}
                  {activeTab === 'Area' && (
                    <>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-center">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.city}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.pincode}</td>
                    </>
                  )}
                  {activeTab === 'Pincode' && (
                    <>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600 text-center">{item.code}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.city}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.area}</td>
                    </>
                  )}

                  {/* Status Toggle - Center Aligned */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={item.status} className="sr-only peer" onChange={() => toggleStatus(item.id, originalData, currentSetData)} />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </td>

                  {/* Actions - Center Aligned */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-slate-500">
                      <button className="hover:text-emerald-600 transition-colors p-1.5 rounded-lg hover:bg-emerald-50" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setCurrentItem(item); setIsEditModalOpen(true); }} className="hover:text-amber-600 transition-colors p-1.5 rounded-lg hover:bg-amber-50" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => triggerDelete(item, currentSetData)} className="hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-800">Add New {activeTab}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">{activeTab === 'Pincode' ? 'Pincode' : 'Name'}</label>
                <input name="name" type="text" required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500" placeholder={`Enter ${activeTab} name`} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">{activeTab === 'Country' ? 'Country Code' : 'Mapping Parent'}</label>
                <input name="extra" type="text" className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500" placeholder={activeTab === 'Country' ? 'e.g. IN' : 'Enter parent name'} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-800">Edit {activeTab}</h3>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">Name / Code</label>
                <input name="name" type="text" defaultValue={currentItem?.name || currentItem?.code} required className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">Update</button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-red-50 animate-fadeIn">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Confirm Delete</h3>
                <p className="text-sm text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-slate-600 text-center">
                Are you sure you want to delete <span className="font-semibold text-slate-800">{itemToDelete?.item.name || itemToDelete?.item.code}</span> from your {activeTab} list?
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }} 
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete} 
                className="px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}