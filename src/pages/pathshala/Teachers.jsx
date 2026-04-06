import { Plus } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import Table from '../../components/common/Table'

const DATA = [{ id: 1, name: 'Hemant Bhai Joshi', batch: 'Junior A', subject: 'Jain Tatva', experience: '10 years', status: 'Active' }]
const columns = [
  { key: 'name', label: 'Name', render: (v) => <span className="font-medium text-slate-700">{v}</span> },
  { key: 'batch', label: 'Batch' },
  { key: 'subject', label: 'Subject' },
  { key: 'experience', label: 'Experience' },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> }
]

export default function Teachers() {
  return (
    <div className="space-y-5">
      <PageHeader title="Teachers" subtitle="Pathshala teacher profiles" breadcrumbs={[{ label: 'Home' }, { label: 'Pathshala' }, { label: 'Teachers' }]} action={<Button size="sm" icon={Plus}>Add Teacher</Button>} />
      <Table columns={columns} data={DATA} emptyMessage="No teachers found" />
    </div>
  )
}