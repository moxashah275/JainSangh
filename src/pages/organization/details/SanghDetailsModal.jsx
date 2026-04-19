import React, { useState } from 'react';
import { X, Users, User, Phone, Mail, MapPin, FileText } from 'lucide-react';
import StatusToggle from '../../../components/common/StatusToggle';

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase text-slate-400">
        <Icon size={12} /> {label}
      </p>
      <p className="text-[13px] font-semibold text-slate-700">{value || '---'}</p>
    </div>
  );
}

function TabButton({ activeTab, setActiveTab, tab, label }) {
  return (
    <button
      type="button"
      onClick={() => setActiveTab(tab)}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        activeTab === tab ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  );
}

export default function SanghDetailsModal({ isOpen, onClose, sangh, allData, onStatusToggle }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !sangh) return null;

  const linkedTrusts = allData.links.filter((link) => link.sanghId === sangh.id && link.status);
  const linkedTrust = linkedTrusts.length ? allData.trusts.find((trust) => trust.id === linkedTrusts[0].trustId) : null;
  const activities = sangh.activity || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Sangh Details</h3>
              <p className="text-xs text-slate-400">{sangh.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-slate-200">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-100 px-6 pt-4 shrink-0">
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="overview" label="Overview" />
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="committee" label="Committee Members" />
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="linked" label="Linked Trust" />
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="activity" label="Activity" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Status</p>
                  <p className={`text-sm font-semibold ${sangh.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {sangh.status ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <StatusToggle status={sangh.status} onToggle={() => onStatusToggle(sangh.id, 'sangh', sangh.status)} />
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Users size={14} className="text-emerald-600" /> Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <DetailItem icon={Users} label="Sangh Name" value={sangh.name} />
                  <DetailItem icon={User} label="Main Person Name" value={sangh.mainPersonName} />
                  <DetailItem icon={Phone} label="Mobile" value={sangh.mobile} />
                  <DetailItem icon={Mail} label="Email" value={sangh.email} />
                  <div className="col-span-2">
                    <DetailItem icon={MapPin} label="Address" value={`${sangh.address}, ${sangh.area}, ${sangh.city}, ${sangh.state}`} />
                  </div>
                  <DetailItem icon={Users} label="Total Families" value={sangh.totalFamilies} />
                  <DetailItem icon={Users} label="Total Members" value={sangh.totalMembers} />
                  <div className="col-span-2">
                    <DetailItem icon={FileText} label="About Sangh" value={sangh.about} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'committee' && (
            <div className="space-y-4">
              {sangh.committee?.length ? (
                sangh.committee.map((member) => (
                  <div key={member.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800">{member.name}</h4>
                        <p className="text-xs font-medium text-emerald-600">{member.designation}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Phone size={11} /> {member.mobile}</span>
                          <span className="flex items-center gap-1"><Mail size={11} /> {member.email}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {member.area}, {member.city}</span>
                        </div>
                      </div>
                      <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${member.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {member.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">No committee members added</div>
              )}
            </div>
          )}

          {activeTab === 'linked' && (
            <div className="space-y-3">
              {linkedTrust ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{linkedTrust.name}</h4>
                      <p className="mt-1 text-xs text-slate-500">{linkedTrust.mainContactPerson} | {linkedTrust.mobile}</p>
                      <p className="mt-1 text-xs text-slate-400">{linkedTrust.area}, {linkedTrust.city}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[10px] font-bold ${linkedTrust.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {linkedTrust.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">No linked trust found</div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activities.length ? (
                activities.map((activity) => (
                  <div key={activity.id} className="rounded-xl border-l-4 border-emerald-500 bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-700">{activity.action}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(activity.timestamp).toLocaleString()} by {activity.user || 'Admin'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">No activity recorded</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
