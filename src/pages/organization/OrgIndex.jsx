import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Users2, Link2 } from 'lucide-react';
import OrgTable from './OrgTable';
import LinkedSanghTrust from './LinkedSanghTrust';
import SelectTypeModal from './forms/SelectTypeModal';
import StatCard from '../../components/common/StatCard';

export default function OrgIndex() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine active tab based on path
  const getActiveTab = () => {
    if (location.pathname.includes('trusts')) return 'Trusts';
    if (location.pathname.includes('sanghs')) return 'Sanghs';
    if (location.pathname.includes('linked')) return 'Linked';
    return 'All Organizations';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());
  const [search, setSearch] = useState('');
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [stats, setStats] = useState({ Trusts: 0, Sanghs: 0, Linked: 0 });
  const [refresh, setRefresh] = useState(0);

  // Update Tab on Route Change
  useEffect(() => {
    setActiveTab(getActiveTab());
    setSearch('');
  }, [location.pathname, refresh]);

  // Stats Data
  const statsData = {
    Trusts: stats.Trusts,
    Sanghs: stats.Sanghs,
    Linked: stats.Linked
  };

  const handleAddClick = () => {
    if (activeTab === 'All Organizations') {
      setIsSelectModalOpen(true);
    } else if (activeTab === 'Trusts') {
      if (window.openTrustModal) window.openTrustModal();
    } else if (activeTab === 'Sanghs') {
      if (window.openSanghModal) window.openSanghModal();
    }
  };

  return (
    <div className="-mx-5 lg:-mx-7 -mt-8 lg:-mt-10 bg-slate-50/40 min-h-screen font-sans pb-10">
      <div className="px-5 lg:px-7 pt-8 pb-4 space-y-5">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
          Organization
        </h1>

        {/* Stats Cards - Matching Location Style */}
        <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-1 min-w-[160px]">
            <StatCard title="Total Trusts" value={statsData.Trusts.toString()} icon={Building2} color="teal" compact className="hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <StatCard title="Total Sanghs" value={statsData.Sanghs.toString()} icon={Users2} color="emerald" compact className="hover:border-emerald-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <StatCard title="Linked Units" value={statsData.Linked.toString()} icon={Link2} color="teal" compact className="hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1" />
          </div>
        </div>

        {/* Tab Navigation - Matching Location Style */}
        <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm flex items-center w-fit">
          {['All Organizations', 'Trusts', 'Sanghs', 'Linked'].map((tab) => {
            const pathMap = {
              'All Organizations': '/organizations/all',
              'Trusts': '/organizations/trusts',
              'Sanghs': '/organizations/sanghs',
              'Linked': '/organizations/linked'
            };
            return (
              <button 
                key={tab} 
                onClick={() => navigate(pathMap[tab])} 
                className="py-4 text-xs font-bold flex-1 relative group outline-none px-6"
              >
                <div className={`absolute inset-x-1 inset-y-1 rounded-lg transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-emerald-50/60' 
                    : 'group-hover:bg-slate-50' 
                }`} />
                <span className={`relative tracking-widest transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent' 
                    : 'text-slate-500 group-hover:text-black' 
                }`}>
                  {tab.toUpperCase()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 lg:px-7 mt-2">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-200/40">
          
          {/* Top Bar: Search, Filter, Add Button */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600" />
              <input 
                type="text" 
                placeholder={activeTab === 'All Organizations' ? "Search organization..." : `Search ${activeTab}...`} 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
               {/* Add Button Logic */}
               {activeTab !== 'Linked' && (
                 <button 
                  onClick={handleAddClick} 
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-bold px-5 py-2.5 transition-all shadow-md text-sm"
                >
                  <Plus size={16} strokeWidth={2.5} /> ADD {activeTab === 'All Organizations' ? 'ORGANIZATION' : activeTab.slice(0, -1).toUpperCase()}
                </button>
               )}
            </div>
          </div>

          {/* Content Area */}
          {activeTab === 'Linked' ? (
            <LinkedSanghTrust onDataChange={(newStats) => { setStats(newStats); setRefresh(r => r+1); }} />
          ) : (
            <OrgTable 
              activeTab={activeTab} 
              searchTerm={search} 
              onDataChange={(newStats) => { setStats(newStats); setRefresh(r => r+1); }}
              refresh={refresh}
            />
          )}

        </div>
      </div>

      {/* Selection Modal for All Organizations Page */}
      {isSelectModalOpen && (
        <SelectTypeModal 
          onClose={() => setIsSelectModalOpen(false)} 
          onSelectTrust={() => { setIsSelectModalOpen(false); setTimeout(() => window.openTrustModal && window.openTrustModal(), 100); }}
          onSelectSangh={() => { setIsSelectModalOpen(false); setTimeout(() => window.openSanghModal && window.openSanghModal(), 100); }}
        />
      )}
    </div>
  );
}