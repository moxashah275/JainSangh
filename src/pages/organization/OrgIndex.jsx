import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, ChevronDown, Building2, Users, Link2 } from 'lucide-react';
import OrgTable from './OrgTable';
import OrgOverview from './OrgOverview';
import LinkedSanghTrust from './LinkedSanghTrust';
import SelectTypeModal from './forms/SelectTypeModal';
import { getOrgData } from './orgData';
import Pagination from '../../components/common/Pagination';

const TABS = ['All Organizations', 'Trust Management', 'Sangh Management', 'Linked Sangh & Trust'];

export default function OrgIndex() {
  const [activeTab, setActiveTab] = useState('All Organizations');
  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [stats, setStats] = useState({ trusts: 0, sanghs: 0, links: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({ linkedId: 'all', status: 'all' });
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const tableRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateStats = () => {
    const data = getOrgData();
    setStats({
      trusts: data.trusts.length,
      sanghs: data.sanghs.length,
      links: data.links.length
    });
  };

  useEffect(() => {
    updateStats();
  }, [refreshKey]);

  const handleReset = () => {
    setFilterValues({ linkedId: 'all', status: 'all' });
  };

  const handleAddClick = () => {
    setIsSelectModalOpen(true);
  };

  const totalPages = Math.ceil(totalEntries / itemsPerPage);
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalEntries);

  return (
    <div className="-mx-5 lg:-mx-7 -mt-8 lg:-mt-10 bg-slate-50/40 min-h-screen font-sans pb-10">
      <div className="px-5 lg:px-7 pt-8 pb-4 space-y-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
          Organization Management
        </h1>

        <OrgOverview stats={stats} />

        {/* Tab Navigation */}
        <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm flex items-center w-full">
          {TABS.map((tab) => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); handleReset(); setCurrentPage(1); setSearch(''); }} 
              className="py-4 text-xs font-bold flex-1 relative group outline-none"
            >
              <div className={`absolute inset-x-1 inset-y-1 rounded-lg transition-all duration-200 ${
                activeTab === tab ? 'bg-green-50/60' : 'group-hover:bg-slate-50'
              }`} />
              <span 
                className="relative tracking-widest transition-all duration-200 text-slate-500 group-hover:text-black"
                style={activeTab === tab ? { color: '#059669' } : {}}
              >
                {tab.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 lg:px-7 mt-2">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab === 'All Organizations' ? 'organizations' : activeTab}...`} 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-50" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end relative">
              {/* Filter Button - Only for Trust and Sangh Management */}
              {(activeTab === 'Trust Management' || activeTab === 'Sangh Management') && (
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold shadow-sm transition-all ${isFilterOpen ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white text-slate-600 hover:border-green-500 hover:text-green-600'}`}
                  >
                    <SlidersHorizontal size={16} strokeWidth={2.5} className="text-green-600" /> Filter
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[100] p-5 animate-in fade-in slide-in-from-top-2 duration-200 font-sans">
                      <div className="space-y-4">
                        {activeTab === 'Trust Management' && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Sangh</label>
                            <div className="relative">
                              <select
                                className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-green-500 transition-all"
                                value={filterValues.linkedId}
                                onChange={(e) => setFilterValues({...filterValues, linkedId: e.target.value})}
                              >
                                <option value="all">All Sanghs</option>
                                {(() => {
                                  const data = getOrgData();
                                  return data.sanghs.map(s => <option key={s.id} value={s.id}>{s.name}</option>);
                                })()}
                              </select>
                              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        )}

                        {activeTab === 'Sangh Management' && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Linked Trust</label>
                            <div className="relative">
                              <select
                                className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none appearance-none focus:border-green-500 transition-all"
                                value={filterValues.linkedId}
                                onChange={(e) => setFilterValues({...filterValues, linkedId: e.target.value})}
                              >
                                <option value="all">All Trusts</option>
                                {(() => {
                                  const data = getOrgData();
                                  return data.trusts.map(t => <option key={t.id} value={t.id}>{t.name}</option>);
                                })()}
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
                                  onChange={() => setFilterValues({...filterValues, status: s})}
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${filterValues.status === s ? 'border-green-500' : 'border-slate-300 group-hover:border-green-400'}`}>
                                  {filterValues.status === s && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                </div>
                                <span className={`text-xs font-bold capitalize ${filterValues.status === s ? 'text-slate-700' : 'text-slate-400'}`}>{s}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button onClick={handleReset} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all">Reset</button>
                          <button onClick={() => setIsFilterOpen(false)} className="flex-1 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg hover:bg-green-600 transition-all">Apply</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Add Button - Only on All Organizations */}
              {activeTab === 'All Organizations' && (
                <button 
                  onClick={handleAddClick} 
                  className="flex items-center gap-2 bg-green-500 text-white rounded-lg font-bold px-5 py-2.5 transition-all shadow-md text-sm hover:bg-green-600"
                >
                  <Plus size={16} strokeWidth={2.5} /> ADD ORGANIZATION
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          {activeTab === 'Linked Sangh & Trust' ? (
            <LinkedSanghTrust onDataChange={() => { updateStats(); setRefreshKey(k => k+1); }} />
          ) : (
            <OrgTable
              ref={tableRef}
              activeTab={activeTab === 'All Organizations' ? 'all' : activeTab === 'Trust Management' ? 'trusts' : 'sanghs'}
              searchTerm={search}
              filterValues={filterValues}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setTotalEntries={setTotalEntries}
              onDataChange={() => { updateStats(); setRefreshKey(k => k+1); }}
            />
          )}

          {/* Pagination */}
          {activeTab !== 'Linked Sangh & Trust' && (
            <Pagination
              currentPage={currentPage}
              totalRecords={totalEntries}
              recordsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onRecordsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
            />
          )}
        </div>
      </div>

      {/* Select Type Modal */}
      {isSelectModalOpen && (
        <SelectTypeModal 
          onClose={() => setIsSelectModalOpen(false)} 
          onSelectTrust={() => { setIsSelectModalOpen(false); setTimeout(() => tableRef.current?.openTrustModal(), 100); }}
          onSelectSangh={() => { setIsSelectModalOpen(false); setTimeout(() => tableRef.current?.openSanghModal(), 100); }}
        />
      )}
    </div>
  );
}