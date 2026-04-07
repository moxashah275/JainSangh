import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import { Pencil, Trash2, Eye } from 'lucide-react';

export default function Managers() {
  const [search, setSearch] = useState('');

  
  const mockManagers = [
    { id: 'MGR001', name: 'Amit Shah', department: 'Operations', phone: '+91 9876543210', status: 'Active' },
    { id: 'MGR002', name: 'Nirav Mehta', department: 'Accounts', phone: '+91 9898989898', status: 'Active' },
    { id: 'MGR003', name: 'Sanjay Jhaveri', department: 'Events', phone: '+91 9123456789', status: 'Inactive' }
  ];

  const filteredManagers = mockManagers.filter(mgr =>
    mgr.name.toLowerCase().includes(search.toLowerCase()) ||
    mgr.department.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'department', label: 'Department' },
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
        <PageHeader 
          title="Managers" 
          subtitle="View and manage organization managers." 
        />
        <button className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-all shadow-sm">
          + Add Manager
        </button>
      </div>

      
      <div className="w-full md:w-1/3">
        <SearchBar 
          placeholder="Search by name or department..." 
          value={search}
          onChange={setSearch}
        />
      </div>

      
      <Table 
        columns={columns} 
        data={filteredManagers} 
        loading={false} 
      />
    </div>
  );
}
