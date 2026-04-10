import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import FilterBar from '../../components/common/FilterBar';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { mockOrgs } from './orgData';

export default function OrgList() {
  const [orgs] = useState(mockOrgs);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [page, setPage] = useState(1);

  
  const filterOptions = [
    { key: 'type', placeholder: 'All Types', items: ['Sangh', 'Trust'] },
    { key: 'status', placeholder: 'All Status', items: ['Active', 'Inactive'] }
  ];

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({ type: '', status: '' });
  };

  
  const filteredOrgs = orgs.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase()) || org.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchesType = filters.type ? org.type === filters.type : true;
    const matchesStatus = filters.status ? org.status === filters.status : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Organization Name', sortable: true },
    { 
      key: 'type', 
      label: 'Type', 
      render: (value) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${value === 'Sangh' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>
          {value}
        </span>
      )
    },
    { key: 'contactPerson', label: 'Contact Person' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (value) => <StatusBadge status={value} /> 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center text-slate-400 transition-all">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-md hover:bg-sky-50 hover:text-sky-600 flex items-center justify-center text-slate-400 transition-all">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button className="w-7 h-7 rounded-md hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Organizations" subtitle="Manage Sanghs, Trusts, and their branch details." />
        <button className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-all shadow-sm">
          + Add Organization
        </button>
      </div>

      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3">
          <SearchBar 
            placeholder="Search by name or contact person..." 
            value={search}
            onChange={setSearch}
          />
        </div>
        <div className="w-full md:w-2/3 flex justify-end">
          <FilterBar 
            filters={filters}
            options={filterOptions}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>
      </div>

      
      <Table 
        columns={columns} 
        data={filteredOrgs} 
        loading={false} 
      />

      
      <Pagination 
        page={page}
        totalPages={1}
        totalItems={filteredOrgs.length}
        perPage={10}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
