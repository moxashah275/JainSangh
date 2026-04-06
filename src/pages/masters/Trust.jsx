import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Table from '../../components/common/Table'

const TRUSTS = [
  { id: 1, name: 'Shree Jain Trust', sangh: 'SJS-AHD', regNo: 'TR-2010-4521', pan: 'AAJTS1234A', balance: 1542000, status: 'Active' }
]
const columns = [
  { key: 'name', label: 'Trust Name', render: (v) => <span className="font-medium text-slate-700">{v}</span> },
  { key: 'sangh', label: 'Sangh' },
  { key: 'regNo', label: 'Reg No', render: (v) => <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded">{v}</span> },
  { key: 'balance', label: 'Balance', render: (v) => <span className="font-semibold text-emerald-600">₹{v.toLocaleString()}</span> },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
  { key: 'actions', label: '', sortable: false, render: () => (
    <div className="flex items-center gap-0.5">
      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-teal-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
      <button className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  )}
]

export default function Trust() {
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const filtered = TRUSTS.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="space-y-5">
      <PageHeader title="Trust Management" subtitle="Manage trusts & bank details" breadcrumbs={[{ label: 'Home' }, { label: 'Masters' }, { label: 'Trust' }]} action={<Button size="sm" icon={Plus} onClick={() => setModal(true)}>Add Trust</Button>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search trusts..." className="max-w-sm" />
      <Table columns={columns} data={filtered} emptyMessage="No trusts found" />
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add New Trust" size="lg" footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => setModal(false)}>Save</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Trust Name" required /><Input label="Sangh" required />
          <Input label="Registration No." required /><Input label="PAN" required />
          <Input label="Bank Name" /><Input label="Account No." />
        </div>
      </Modal>
    </div>
  )
}