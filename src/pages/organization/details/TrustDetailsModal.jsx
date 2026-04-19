import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, MapPin, Users, FileText } from 'lucide-react';
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

export default function TrustDetailsModal({ isOpen, onClose, trust, allData, onStatusToggle }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !trust) return null;

  const linkedSanghs = allData.links.filter((link) => link.trustId === trust.id && link.status);
  const activities = trust.activity || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Trust Details</h3>
              <p className="text-xs text-slate-400">{trust.name}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-slate-200">
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-100 px-6 pt-4 shrink-0">
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="overview" label="Overview" />
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="team" label="Team Members" />
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="linked" label="Linked Sanghs" />
          <TabButton activeTab={activeTab} setActiveTab={setActiveTab} tab="activity" label="Activity" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Status</p>
                  <p className={`text-sm font-semibold ${trust.status ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trust.status ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <StatusToggle status={trust.status} onToggle={() => onStatusToggle(trust.id, 'trust', trust.status)} />
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <Building2 size={14} className="text-emerald-600" /> Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <DetailItem icon={Building2} label="Trust Name" value={trust.name} />
                  <DetailItem icon={User} label="Main Contact Person" value={trust.mainContactPerson} />
                  <DetailItem icon={Phone} label="Mobile" value={trust.mobile} />
                  <DetailItem icon={Mail} label="Email" value={trust.email} />
                  <div className="col-span-2">
                    <DetailItem icon={MapPin} label="Address" value={`${trust.address}, ${trust.area}, ${trust.city}, ${trust.state}`} />
                  </div>
                  <DetailItem icon={Users} label="Total Members" value={trust.totalMembers} />
                  <div className="col-span-2">
                    <DetailItem icon={FileText} label="About Trust" value={trust.about} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              {trust.team?.length ? (
                trust.team.map((member) => (
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
                <div className="py-8 text-center text-slate-400">No team members added</div>
              )}
            </div>
          )}

          {activeTab === 'linked' && (
            <div className="space-y-3">
              {linkedSanghs.length ? (
                linkedSanghs.map((link) => {
                  const sangh = allData.sanghs.find((item) => item.id === link.sanghId);
                  return (
                    <div key={link.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800">{sangh?.name || 'Unknown Sangh'}</h4>
                          <p className="mt-1 text-xs text-slate-500">{sangh?.mainPersonName} | {sangh?.mobile}</p>
                          <p className="mt-1 text-xs text-slate-400">{sangh?.area}, {sangh?.city}</p>
                        </div>
                        <span className={`rounded px-2 py-1 text-[10px] font-bold ${sangh?.status ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {sangh?.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">No linked sanghs found</div>
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
