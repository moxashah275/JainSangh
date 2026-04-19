import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomDropdown from '../../components/common/CustomDropdown';
import OrgTable from './OrgTable';
import OrgOverview from './OrgOverview';
import LinkedSanghTrust from './LinkedSanghTrust';
import SelectTypeModal from './forms/SelectTypeModal';
import { getOrgData } from './orgData';
import Pagination from '../../components/common/Pagination';

const TAB_CONFIGS = [
  {
    key: 'all',
    label: 'All Organizations',
    path: '/organizations/all',
    tableTab: 'all',
    searchLabel: 'organizations',
    addLabel: 'Add Organization',
    addMode: 'select',
    summary: 'Manage all trust and sangh records from one place.',
  },
  {
    key: 'trusts',
    label: 'Trust Management',
    path: '/organizations/trusts',
    tableTab: 'trusts',
    searchLabel: 'trusts',
    addLabel: 'Add Trust',
    addMode: 'trust',
    filterLabel: 'Linked Sangh',
    summary: 'Trust records with location, status, and linked sangh filters.',
  },
  {
    key: 'sanghs',
    label: 'Sangh Management',
    path: '/organizations/sanghs',
    tableTab: 'sanghs',
    searchLabel: 'sanghs',
    addLabel: 'Add Sangh',
    addMode: 'sangh',
    filterLabel: 'Linked Trust',
    summary: 'Sangh records with member totals and linked trust filters.',
  },
  {
    key: 'linked',
    label: 'Linked Sangh & Trust',
    path: '/organizations/linked',
    searchLabel: 'links',
    summary: 'Link trusts and sanghs from the same professional workspace.',
  },
];

const DEFAULT_FILTER_VALUES = {
  linkedId: 'all',
  status: 'all',
};

export default function OrgIndex() {
  const location = useLocation();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const filterRef = useRef(null);

  const activeTab = useMemo(
    () => TAB_CONFIGS.find((tab) => tab.path === location.pathname) || TAB_CONFIGS[0],
    [location.pathname]
  );

  const [search, setSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [stats, setStats] = useState({ trusts: 0, sanghs: 0, links: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSearch('');
    setCurrentPage(1);
    setIsFilterOpen(false);
    setFilterValues(DEFAULT_FILTER_VALUES);
  }, [activeTab.key]);

  useEffect(() => {
    const data = getOrgData();
    setStats({
      trusts: data.trusts.length,
      sanghs: data.sanghs.length,
      links: data.links.length,
    });
  }, [refreshKey]);

  const linkedOptions = useMemo(() => {
    if (activeTab.key !== 'trusts' && activeTab.key !== 'sanghs') {
      return [];
    }

    const data = getOrgData();
    const list = activeTab.key === 'trusts' ? data.sanghs : data.trusts;
    const label = activeTab.key === 'trusts' ? 'Sanghs' : 'Trusts';

    return [
      { label: `All ${label}`, value: 'all' },
      ...list.map((item) => ({ label: item.name, value: item.id })),
    ];
  }, [activeTab.key, refreshKey]);

  const handleResetFilters = () => {
    setFilterValues(DEFAULT_FILTER_VALUES);
  };

  const handleAddClick = () => {
    if (activeTab.addMode === 'trust') {
      tableRef.current?.openTrustModal();
      return;
    }

    if (activeTab.addMode === 'sangh') {
      tableRef.current?.openSanghModal();
      return;
    }

    setIsSelectModalOpen(true);
  };

  const handleDataChange = () => {
    setRefreshKey((value) => value + 1);
  };

  return (
    <div className="-mx-5 -mt-8 min-h-screen bg-slate-50/40 pb-10 font-sans text-slate-900 lg:-mx-7 lg:-mt-10">
      <div className="space-y-5 px-5 pb-4 pt-8 lg:px-7">
        <div className="space-y-1.5">
          <h1 className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Organization Management
          </h1>
          <p className="text-sm font-medium text-slate-500">{activeTab.summary}</p>
        </div>

        <OrgOverview stats={stats} />

        <div className="flex w-full items-center rounded-xl border border-slate-100 bg-white p-1 shadow-sm">
          {TAB_CONFIGS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => navigate(tab.path)}
              className="group relative flex-1 py-4 text-xs font-bold outline-none"
            >
              <div
                className={`absolute inset-x-1 inset-y-1 rounded-lg transition-all duration-200 ${
                  activeTab.key === tab.key ? 'bg-emerald-50/60' : 'group-hover:bg-slate-50'
                }`}
              />
              <span
                className={`relative tracking-widest transition-all duration-200 ${
                  activeTab.key === tab.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'
                    : 'text-slate-500 group-hover:text-black'
                }`}
              >
                {tab.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 px-5 lg:px-7">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/40">
          <div className="mb-5 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="group relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600" />
              <input
                type="text"
                placeholder={`Search ${activeTab.searchLabel || 'records'}...`}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="relative flex w-full items-center justify-end gap-2.5 md:w-auto" ref={filterRef}>
              {(activeTab.key === 'trusts' || activeTab.key === 'sanghs') && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen((current) => !current)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm transition-all ${
                      isFilterOpen
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600'
                    }`}
                  >
                    <SlidersHorizontal size={16} strokeWidth={2.5} className="text-emerald-600" />
                    Filter
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 z-[100] mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="pl-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {activeTab.filterLabel}
                          </label>
                          <CustomDropdown
                            value={filterValues.linkedId}
                            items={linkedOptions}
                            onChange={(value) => setFilterValues((current) => ({ ...current, linkedId: value }))}
                            placeholder={`All ${activeTab.key === 'trusts' ? 'Sanghs' : 'Trusts'}`}
                            searchable={false}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="pl-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </label>
                          <div className="flex items-center gap-4 pl-1">
                            {['all', 'active', 'inactive'].map((status) => (
                              <label key={status} className="group flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  name="status"
                                  className="hidden"
                                  checked={filterValues.status === status}
                                  onChange={() => setFilterValues((current) => ({ ...current, status }))}
                                />
                                <div
                                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                                    filterValues.status === status
                                      ? 'border-emerald-500'
                                      : 'border-slate-300 group-hover:border-emerald-400'
                                  }`}
                                >
                                  {filterValues.status === status && (
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                  )}
                                </div>
                                <span
                                  className={`text-xs font-bold capitalize ${
                                    filterValues.status === status ? 'text-slate-700' : 'text-slate-400'
                                  }`}
                                >
                                  {status}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 transition-all hover:bg-slate-50"
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsFilterOpen(false)}
                            className="flex-1 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-600"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab.key !== 'linked' && (
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  {activeTab.addLabel?.toUpperCase()}
                </button>
              )}
            </div>
          </div>

          {activeTab.key === 'linked' ? (
            <LinkedSanghTrust key={activeTab.key} searchTerm={search} onDataChange={handleDataChange} />
          ) : (
            <>
              <OrgTable
                key={activeTab.key}
                ref={tableRef}
                activeTab={activeTab.tableTab}
                searchTerm={search}
                filterValues={filterValues}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setTotalEntries={setTotalEntries}
                onDataChange={handleDataChange}
              />
              <Pagination
                currentPage={currentPage}
                totalRecords={totalEntries}
                recordsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onRecordsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>

      {isSelectModalOpen && (
        <SelectTypeModal
          onClose={() => setIsSelectModalOpen(false)}
          onSelectTrust={() => {
            setIsSelectModalOpen(false);
            setTimeout(() => tableRef.current?.openTrustModal(), 100);
          }}
          onSelectSangh={() => {
            setIsSelectModalOpen(false);
            setTimeout(() => tableRef.current?.openSanghModal(), 100);
          }}
        />
      )}
    </div>
  );
}
