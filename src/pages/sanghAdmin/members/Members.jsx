import React, { useState } from 'react';
import { Users, UserCheck, HandHeart, Shield, Search, Plus } from 'lucide-react';
import CommonPageLayout from '../../../components/common/CommonPageLayout';
import Table from '../../../components/common/Table';
import Pagination from '../../../components/common/Pagination';

export default function Members() {
  const [activeTab, setActiveTab] = useState('Families');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const tabs = ['Families', 'Individual Member', 'Volunteers'];

  const stats = [
    { title: 'Total Family', value: '1,240', icon: Users, color: 'teal' },
    { title: 'Total Individual Member', value: '4,850', icon: UserCheck, color: 'emerald' },
    { title: 'Volunteers', value: '156', icon: HandHeart, color: 'sky' },
    { title: 'Active Volunteers', value: '84', icon: Shield, color: 'amber' },
  ];

  // Dummy Data for Table
  const familiesData = [
    { id: 1, family_head: 'Rajesh Shah', members_count: 5, address: '123, Jain Society', status: 'Active' },
    { id: 2, family_head: 'Suresh Mehta', members_count: 4, address: '45, Adarsh Nagar', status: 'Active' },
    { id: 3, family_head: 'Amit Jain', members_count: 3, address: '12, Mahaveer Marg', status: 'Inactive' },
  ];

  const membersData = [
    { id: 1, name: 'Anik Shah', family: 'Rajesh Shah', role: 'Son', age: 24, status: 'Active' },
    { id: 2, name: 'Megha Shah', family: 'Rajesh Shah', role: 'Daughter', age: 21, status: 'Active' },
    { id: 3, name: 'Rita Shah', family: 'Rajesh Shah', role: 'Wife', age: 48, status: 'Active' },
  ];

  const volunteersData = [
    { id: 1, name: 'Vikas Jain', phones: '9876543210', skill: 'Event Management', experience: '3 Years', status: 'Active' },
    { id: 2, name: 'Pratik Mehta', phones: '9825011223', skill: 'Public Relations', experience: '5 Years', status: 'Active' },
    { id: 3, name: 'Sagar Doshi', phones: '9988776655', skill: 'Social Media', experience: '2 Years', status: 'Active' },
  ];

  const getActiveData = () => {
    switch(activeTab) {
      case 'Families': return familiesData;
      case 'Individual Member': return membersData;
      case 'Volunteers': return volunteersData;
      default: return [];
    }
  };

  const columns = {
    Families: [
      { key: 'sr_no', label: 'Sr. No', render: (_, __, i) => i + 1 },
      { key: 'family_head', label: 'Family Head Name', render: (val) => <span className="font-bold text-teal-700">{val}</span> },
      { key: 'members_count', label: 'Members', align: 'center' },
      { key: 'address', label: 'Registered Address' },
      { key: 'status', label: 'Status', align: 'center', render: (val) => (
          <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${val === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {val}
          </span>
      )},
    ],
    'Individual Member': [
      { key: 'sr_no', label: 'Sr. No', render: (_, __, i) => i + 1 },
      { key: 'name', label: 'Member Name', render: (val) => <span className="font-bold text-teal-700">{val}</span> },
      { key: 'family', label: 'Family Head' },
      { key: 'role', label: 'Relationship' },
      { key: 'age', label: 'Age', align: 'center' },
      { key: 'status', label: 'Status', align: 'center', render: (val) => (
          <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${val === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {val}
          </span>
      )},
    ],
    Volunteers: [
      { key: 'sr_no', label: 'Sr. No', render: (_, __, i) => i + 1 },
      { key: 'name', label: 'Volunteer Name', render: (val) => <span className="font-bold text-teal-700">{val}</span> },
      { key: 'phones', label: 'Contact Number' },
      { key: 'skill', label: 'Primary Skill' },
      { key: 'experience', label: 'Experience' },
      { key: 'status', label: 'Status', align: 'center', render: (val) => (
          <span className={`px-3 py-1 rounded-lg text-[11px] font-bold ${val === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            {val}
          </span>
      )},
    ],
  };

  return (
    <CommonPageLayout 
      title="Member Management" 
      stats={stats}
    >
      {/* Premium Tab Switcher Row */}
      <div className="bg-white rounded-xl border border-slate-100 p-1 mb-5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-teal-50 text-teal-700 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-500">
        {/* Search & Actions Area */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-sm relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeTab}...`}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/30 text-[13px] outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 transition-all font-medium"
            />
          </div>
          
          <button
            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab.slice(0, -1)}</span>
          </button>
        </div>

        {/* Table View */}
        <Table 
          columns={columns[activeTab]} 
          data={getActiveData()} 
          loading={loading}
          skipCard
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalRecords={getActiveData().length}
          recordsPerPage={recordsPerPage}
          onPageChange={setCurrentPage}
          onRecordsPerPageChange={setRecordsPerPage}
        />
      </div>
    </CommonPageLayout>
  );
}
