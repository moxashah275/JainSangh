import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import SanghCard from '../../components/organization/SanghCard';
import TrustCard from '../../components/organization/TrustCard';

export default function OrgOverview() {
  
  const sanghs = [
    { id: 1, name: 'Shree Navkar Mahasangh', location: 'Paldi, Ahmedabad', memberCount: 150 },
    { id: 2, name: 'Adinath Seva Sangh', location: 'Navrangpura, Ahmedabad', memberCount: 85 }
  ];

  const trusts = [
    { id: 1, name: 'Jain Kalyan Trust', regNo: 'REG12345', phone: '+91 9898054321' },
    { id: 2, name: 'Shree Shanti Seva Trust', regNo: 'REG67890', phone: '+91 9426012345' }
  ];

  const handleEdit = (item) => alert(`Editing: ${item.name}`);
  const handleDelete = (id) => alert(`Deleting item with ID: ${id}`);

  return (
    <div className="p-6 space-y-6">
      <PageHeader 
        title="Organization Overview" 
        subtitle="Manage all your Sanghs and Trusts from one place." 
      />

      {/* Sangh Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-bold text-slate-800">Registered Sanghs</h3>
          <button className="text-[12px] font-bold text-teal-600 hover:text-teal-700 transition-colors">+ Add Sangh</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sanghs.map(sangh => (
            <SanghCard key={sangh.id} sangh={sangh} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-bold text-slate-800">Registered Trusts</h3>
          <button className="text-[12px] font-bold text-teal-600 hover:text-teal-700 transition-colors">+ Add Trust</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trusts.map(trust => (
            <TrustCard key={trust.id} trust={trust} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}