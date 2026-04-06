import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, RotateCcw, User, HandHeart } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export default function AddDonation() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ donorName: '', phone: '', type: '', amount: '', date: new Date().toISOString().split('T')[0], mode: '', notes: '' })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Add New Donation" subtitle="Record a new donation entry" breadcrumbs={[{ label: 'Home' }, { label: 'Donations' }, { label: 'Add New' }]} action={<Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => navigate('/donations')}>Cancel</Button>} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center gap-2 mb-5"><User className="w-4 h-4 text-teal-600" /><h3 className="text-sm font-semibold text-slate-800">Donor Information</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Donor Name" name="donorName" value={form.donorName} onChange={handleChange} placeholder="Full name" required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="98XXXXXXXX" icon={User} />
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} required />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center gap-2 mb-5"><HandHeart className="w-4 h-4 text-teal-600" /><h3 className="text-sm font-semibold text-slate-800">Donation Details</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Type <span className="text-rose-500">*</span></label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-50 outline-none transition-all">
              <option value="">Select Type</option>
              {['Jivdaya', 'Devdravya', 'Derasar Nidhi', 'Pathshala', 'Aayambil', 'General'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <Input label="Amount (₹)" name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Enter amount" required />
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600">Mode <span className="text-rose-500">*</span></label>
            <select name="mode" value={form.mode} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-50 outline-none transition-all">
              <option value="">Select Mode</option>
              {['Cash', 'Cheque', 'Online', 'UPI'].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4"><Input label="Notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" /></div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" icon={RotateCcw}>Reset</Button>
        <Button icon={Save} onClick={() => navigate('/donations')}>Save Donation</Button>
      </div>
    </div>
  )
}