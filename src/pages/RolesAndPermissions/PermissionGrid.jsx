import React from 'react'
import { Check, Minus, Pencil, Trash2, Plus, X, Save, Settings } from 'lucide-react'
import { PERM_GROUPS, ICONS, hasPerm, addPermToGroup, updatePermInGroup, deletePermFromGroup, addPermGroup, deletePermGroup } from './roleData'

var PermCard = React.memo(function(props) {
  var group = props.group
  var role = props.role
  var Icon = ICONS[group.icon] || Settings
  var active = group.perms.filter(function(p) {
    return hasPerm(role, group.key + '_' + p.toLowerCase().replace(/\s+/g, '_'))
  }).length
  var total = group.perms.length
  var full = active === total

  return (
    <div className={'border rounded-xl p-3.5 transition-all duration-200 ' + (full ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-white hover:shadow-sm hover:shadow-slate-200/50')}>
      <div className="flex justify-between items-center mb-2.5">
        <div className="flex items-center gap-2">
          <div className={'w-7 h-7 rounded-lg flex items-center justify-center ' + (full ? 'bg-emerald-100' : 'bg-slate-100')}>
            <Icon className={'w-3.5 h-3.5 ' + (full ? 'text-emerald-600' : 'text-slate-400')} strokeWidth={2} />
          </div>
          <span className="font-bold text-[12px] text-slate-700">{group.label}</span>
        </div>
        {full ? (
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">All Granted</span>
        ) : (
          <span className={'text-[9px] font-bold px-2 py-0.5 rounded-full ' + (active > 0 ? 'bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400')}>
            {active}/{total}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {group.perms.map(function(perm) {
          var ok = hasPerm(role, group.key + '_' + perm.toLowerCase().replace(/\s+/g, '_'))
          return (
            <span key={perm} className={'text-[10px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ' + (ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400 line-through')}>
              {ok ? <Check className="w-2.5 h-2.5" strokeWidth={3} /> : <Minus className="w-2.5 h-2.5" strokeWidth={2} />}
              {perm}
            </span>
          )
        })}
      </div>
    </div>
  )
})
PermCard.displayName = 'PermCard'

export function PermissionManager(props) {
  var filterType = props.filterType
  var onChange = props.onChange
  var groups = filterType ? PERM_GROUPS.filter(function(g) { return g.type === filterType }) : PERM_GROUPS

  var _addSt = React.useState(null); var addingTo = _addSt[0]; var setAddingTo = _addSt[1]
  var _addVal = React.useState(''); var addVal = _addVal[0]; var setAddVal = _addVal[1]
  var _editSt = React.useState(null); var editing = _editSt[0]; var setEditing = _editSt[1]
  var _editVal = React.useState(''); var editVal = _editVal[0]; var setEditVal = _editVal[1]
  var _grpSt = React.useState(false); var showAddGrp = _grpSt[0]; var setShowAddGrp = _grpSt[1]
  var _grpForm = React.useState({ key: '', label: '', type: 'System' }); var grpForm = _grpForm[0]; var setGrpForm = _grpForm[1]
  var _delSt = React.useState(null); var deleting = _delSt[0]; var setDeleting = _delSt[1]

  var inputCls = 'w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 transition-all font-medium'

  var doAdd = function() {
    if (!addVal.trim() || !addingTo) return
    addPermToGroup(addingTo, addVal.trim())
    setAddVal(''); setAddingTo(null)
    if (onChange) onChange()
  }
  var doUpdate = function() {
    if (!editVal.trim() || !editing) return
    updatePermInGroup(editing.group, editing.old, editVal.trim())
    setEditVal(''); setEditing(null)
    if (onChange) onChange()
  }
  var doDeletePerm = function(groupKey, perm) {
    deletePermFromGroup(groupKey, perm)
    setDeleting(null)
    if (onChange) onChange()
  }
  var doAddGroup = function() {
    if (!grpForm.key.trim() || !grpForm.label.trim()) return
    addPermGroup(grpForm.key.trim().toLowerCase().replace(/\s+/g, '_'), grpForm.label.trim(), 'Settings', grpForm.type)
    setShowAddGrp(false); setGrpForm({ key: '', label: '', type: 'System' })
    if (onChange) onChange()
  }
  var doDeleteGroup = function(key) {
    deletePermGroup(key)
    setDeleting(null)
    if (onChange) onChange()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-bold text-slate-800">Permission Groups</h3>
          <p className="text-[10px] text-slate-400">Add, edit, or delete permissions</p>
        </div>
        <button onClick={function() { setShowAddGrp(true) }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-[11px] font-bold rounded-lg hover:bg-teal-700 transition-colors">
          <Plus className="w-3 h-3" /> Add Group
        </button>
      </div>

      {showAddGrp && (
        <div className="bg-teal-50/30 p-3 rounded-xl border border-teal-100" style={{ animation: 'slideDown 0.2s ease-out' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700">New Permission Group</span>
            <button onClick={function() { setShowAddGrp(false) }} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-[9px] font-bold text-slate-500 mb-0.5 block">Key</label>
              <input value={grpForm.key} onChange={function(e) { setGrpForm(Object.assign({}, grpForm, { key: e.target.value })) }} placeholder="e.g. inventory" className={inputCls} />
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-bold text-slate-500 mb-0.5 block">Label</label>
              <input value={grpForm.label} onChange={function(e) { setGrpForm(Object.assign({}, grpForm, { label: e.target.value })) }} placeholder="e.g. Inventory" className={inputCls} />
            </div>
            <div className="w-28">
              <label className="text-[9px] font-bold text-slate-500 mb-0.5 block">Type</label>
              <select value={grpForm.type} onChange={function(e) { setGrpForm(Object.assign({}, grpForm, { type: e.target.value })) }} className={inputCls}>
                <option value="System">System</option>
                <option value="Sangh">Sangh</option>
                <option value="Trust">Trust</option>
              </select>
            </div>
            <button onClick={doAddGroup} className="px-3 py-1.5 bg-teal-600 text-white text-[10px] font-bold rounded-lg hover:bg-teal-700 shrink-0"><Save className="w-3 h-3" /></button>
          </div>
        </div>
      )}

      {groups.map(function(group) {
        var Icon = ICONS[group.icon] || Settings
        var isDeletingGrp = deleting === 'group_' + group.key
        return (
          <div key={group.key} className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-slate-500" />
                </div>
                <span className="font-bold text-[11px] text-slate-700">{group.label}</span>
                <span className="text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">{group.type}</span>
                <span className="text-[9px] font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full">{group.perms.length}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={function() { setAddingTo(group.key); setAddVal('') }} className="w-6 h-6 rounded-md bg-slate-50 hover:bg-teal-50 hover:text-teal-600 flex items-center justify-center text-slate-400 transition-all" title="Add permission">
                  <Plus className="w-3 h-3" />
                </button>
                {isDeletingGrp ? (
                  <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5 ml-1" style={{ animation: 'slideDown 0.15s ease-out' }}>
                    <span className="text-[8px] font-bold text-rose-600">Delete group?</span>
                    <button onClick={function() { doDeleteGroup(group.key) }} className="text-[8px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded hover:bg-rose-700">Yes</button>
                    <button onClick={function() { setDeleting(null) }} className="text-[8px] font-bold bg-white text-slate-600 px-1.5 py-0.5 rounded hover:bg-slate-100 border border-slate-200">No</button>
                  </span>
                ) : (
                  <button onClick={function() { setDeleting('group_' + group.key) }} className="w-6 h-6 rounded-md bg-slate-50 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-400 transition-all" title="Delete group">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {addingTo === group.key && (
              <div className="flex items-center gap-1.5 mb-2" style={{ animation: 'slideDown 0.15s ease-out' }}>
                <input value={addVal} onChange={function(e) { setAddVal(e.target.value) }} placeholder="Permission name..." className={inputCls + ' flex-1'}
                  onKeyDown={function(e) { if (e.key === 'Enter') doAdd(); if (e.key === 'Escape') { setAddingTo(null); setAddVal('') } }} autoFocus />
                <button onClick={doAdd} className="px-2 py-1.5 bg-teal-600 text-white text-[9px] font-bold rounded-md hover:bg-teal-700">Add</button>
                <button onClick={function() { setAddingTo(null); setAddVal('') }} className="px-2 py-1.5 bg-white border border-slate-200 text-slate-500 text-[9px] font-bold rounded-md hover:bg-slate-50">Cancel</button>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {group.perms.map(function(perm) {
                var isEditing = editing && editing.group === group.key && editing.old === perm
                var isDeleting = deleting === group.key + '_' + perm
                if (isEditing) {
                  return (
                    <span key={perm} className="inline-flex items-center gap-1 bg-sky-50 border border-sky-200 rounded-md px-1.5 py-0.5">
                      <input value={editVal} onChange={function(e) { setEditVal(e.target.value) }} className="w-16 px-1 py-0 bg-white border border-slate-200 rounded text-[9px] text-slate-700 focus:outline-none focus:border-teal-500"
                        onKeyDown={function(e) { if (e.key === 'Enter') doUpdate(); if (e.key === 'Escape') setEditing(null) }} autoFocus />
                      <button onClick={doUpdate} className="text-sky-600 hover:text-sky-700"><Save className="w-2.5 h-2.5" /></button>
                      <button onClick={function() { setEditing(null) }} className="text-slate-400 hover:text-slate-600"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  )
                }
                if (isDeleting) {
                  return (
                    <span key={perm} className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 rounded-md px-1.5 py-0.5" style={{ animation: 'slideDown 0.1s ease-out' }}>
                      <span className="text-[9px] text-rose-600 font-medium">Delete?</span>
                      <button onClick={function() { doDeletePerm(group.key, perm) }} className="text-[8px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded hover:bg-rose-700">Yes</button>
                      <button onClick={function() { setDeleting(null) }} className="text-[8px] font-bold bg-white text-slate-600 px-1.5 py-0.5 rounded hover:bg-slate-100 border border-slate-200">No</button>
                    </span>
                  )
                }
                return (
                  <span key={perm} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 group/tag hover:border-slate-200 transition-all">
                    {perm}
                    <button onClick={function() { setEditing({ group: group.key, old: perm }); setEditVal(perm) }} className="opacity-0 group-hover/tag:opacity-100 text-slate-400 hover:text-sky-600 transition-all" title="Edit">
                      <Pencil className="w-2.5 h-2.5" />
                    </button>
                    <button onClick={function() { setDeleting(group.key + '_' + perm) }} className="opacity-0 group-hover/tag:opacity-100 text-slate-400 hover:text-rose-600 transition-all" title="Delete">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )
              })}
              {group.perms.length === 0 && <span className="text-[10px] text-slate-400 italic">No permissions — click + to add</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function PermissionGrid(props) {
  var role = props.role
  var filterType = props.filterType
  if (!role) return null
  var groups = filterType ? PERM_GROUPS.filter(function(g) { return g.type === filterType }) : PERM_GROUPS
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {groups.map(function(group) { return <PermCard key={group.key} group={group} role={role} /> })}
    </div>
  )
}