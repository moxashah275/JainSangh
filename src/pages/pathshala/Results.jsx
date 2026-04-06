import PageHeader from '../../components/common/PageHeader'
import Table from '../../components/common/Table'
import StatusBadge from '../../components/common/StatusBadge'

const DATA = [{ id: 1, student: 'Aarav Shah', exam: 'Monthly Jan', marks: 95, total: 100, grade: 'A+', status: 'Passed' }]
const columns = [
  { key: 'student', label: 'Student', render: (v) => <span className="font-medium text-slate-700">{v}</span> },
  { key: 'exam', label: 'Exam' },
  { key: 'marks', label: 'Marks', render: (v, row) => <span className="font-semibold text-slate-800">{v}/{row.total}</span> },
  { key: 'grade', label: 'Grade', render: (v) => <span className="text-sm font-bold text-teal-600">{v}</span> },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> }
]

export default function Results() {
  return (
    <div className="space-y-5">
      <PageHeader title="Results" subtitle="Exam results & grading" breadcrumbs={[{ label: 'Home' }, { label: 'Pathshala' }, { label: 'Results' }]} />
      <Table columns={columns} data={DATA} emptyMessage="No results found" />
    </div>
  )
}