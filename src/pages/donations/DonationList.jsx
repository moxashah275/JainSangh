import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download, Pencil, Trash2, FileText } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import Table from '../../components/common/Table'

const DONATIONS = [
  { id: 1, donorName: 'Rajesh Shah', type: 'Devdravya', amount: 51000, date: '2025-01-15', mode: 'Cheque', status: 'Verified', receiptNo: 'RCP-001' },
  { id: 2, donorName: 'Meena Patel', type: 'Jivdaya', amount: 25000, date: '2025-01-18', mode: 'Online', status: 'Pending', receiptNo: 'RCP-002' },
  { id: 3, donorName: 'Suresh Jain', type: 'Pathshala', amount: 10000, date: '2025-01-20', mode: 'Cash', status: 'Verified', receiptNo: 'RCP-003' }
]

export default function DonationList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const filtered = DONATIONS.filter((d) => d.donorName.toLowerCase().includes(search.toLowerCase()))
  const columns = [
    { key: 'receiptNo', label: 'Receipt', render: (v) => <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded">{v}</span> },
    { key: 'donorName', label: 'Donor', render: (v) => <span className="font-medium text-slate-700">{v}</span> },
    { key: 'type', label: 'Type', render: (v) => <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{v}</span> },
    { key: 'amount', label: 'Amount', render: (v) => <span className="font-semibold text-slate-800">₹{v.toLocaleString()}</span> },
    { key: 'date', label: 'Date' },
    { key: 'mode', label: 'Mode' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'actions', label: '', sortable: false, render: (_, row) => (
      <div className="flex items-center gap-0.5">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/donations/receipt/${row.id}`) }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors"><FileText className="w-3.5 h-3.5" /></button>
        <button onClick={(e) => { e.stopPropagation(); navigate(`/donations/edit/${row.id}`) }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-sky-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
        <button className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    )}
  ]

  return (
    <div className="space-y-5">
      <PageHeader title="Donation Management" subtitle="Track donations & generate receipts" breadcrumbs={[{ label: 'Home' }, { label: 'Donations' }]} action={<div className="flex items-center gap-2"><Button variant="secondary" size="sm" icon={Download}>Export</Button><Button size="sm" icon={Plus} onClick={() => navigate('/donations/add')}>Add Donation</Button></div>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search by donor..." className="max-w-sm" />
      <Table columns={columns} data={filtered} emptyMessage="No donations found" onRowClick={(row) => navigate(`/donations/receipt/${row.id}`)} />
    </div>
  )
}