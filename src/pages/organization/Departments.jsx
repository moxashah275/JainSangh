import React from 'react';
import PageHeader from '../../components/common/PageHeader';
import DepartmentCard from '../../components/organization/DepartmentCard';

export default function Departments() {
  const departments = [
    { id: 1, name: 'Accounts & Finance', description: 'Manages all donations and expenses.', staffCount: 4 },
    { id: 2, name: 'Event Management', description: 'Handles pathshala and festival events.', staffCount: 8 },
    { id: 3, name: 'Derasar Maintenance', description: 'Look after daily activities of Derasar.', staffCount: 5 }
  ];

  const handleEdit = (dept) => alert(`Editing department: ${dept.name}`);
  const handleDelete = (id) => alert(`Deleting department ID: ${id}`);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Departments" 
          subtitle="Manage various functional departments of the organization." 
        />
        <button className="px-5 py-2.5 bg-teal-600 text-white text-[13px] font-bold rounded-xl hover:bg-teal-700 transition-all shadow-sm">
          + Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map(dept => (
          <DepartmentCard key={dept.id} dept={dept} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}