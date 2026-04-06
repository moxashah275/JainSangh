import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Table from '../../components/common/Table'

const SANGHS = [
  { id: 1, name: 'Shree Jain Sangh - Ahmedabad', code: 'SJS-AHD', city: 'Ahmedabad', area: 'Navrangpura', members: 450, trusts: 3, status: 'Active' },
  { id: 2, name: 'Shree Jain Sangh - Surat', code: 'SJS-SRT', city: 'Surat', area: 'Adajan', members: 320, trusts: 2, status: 'Active' }
]
const columns = [
  { key: 'name', label: 'Name', render: (v) => <span className="font-medium text-slate-700">{v}</span> },
  { key: 'code', label: 'Code', render: (v) => <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded">{v}</span> },
  { key: 'city', label: 'City' },
  { key: 'members', label: 'Members', render: (v) => <span className="font-medium">{v}</span> },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
  { key: 'actions', label: '', sortable: false, render: () => (
    <div className="flex items-center gap-0.5">
      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
      <button className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  )}
]

export default function Sangh() {
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const filtered = SANGHS.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-5">
      <PageHeader title="Sangh Management" subtitle="Manage Sangh profiles" breadcrumbs={[{ label: 'Home' }, { label: 'Masters' }, { label: 'Sangh' }]} action={<Button size="sm" icon={Plus} onClick={() => setModal(true)}>Add Sangh</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search sanghs..." className="max-w-sm" />
      <Table columns={columns} data={filtered} emptyMessage="No sanghs found" />
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add New Sangh" size="lg" footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => setModal(false)}>Save</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Sangh Name" placeholder="e.g. Shree Jain Sangh" required />
          <Input label="Sangh Code" placeholder="e.g. SJS-AHD" required />
          <Input label="City" placeholder="Select city" />
          <Input label="Area" placeholder="Select area" />
          <Input label="Formation Date" type="date" />
        </div>
      </Modal>
    </div>
  )
}