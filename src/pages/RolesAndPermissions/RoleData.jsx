import {
  LayoutDashboard, MapPin, Users, Landmark, HandHeart,
  BookOpen, BarChart3, Bell, Gem, UserCog, Settings,
  CalendarDays, FileText, Receipt
} from 'lucide-react'

export var ICONS = {
  LayoutDashboard: LayoutDashboard, MapPin: MapPin, Users: Users, Landmark: Landmark, HandHeart: HandHeart,
  BookOpen: BookOpen, BarChart3: BarChart3, Bell: Bell, Gem: Gem, UserCog: UserCog, Settings: Settings,
  CalendarDays: CalendarDays, FileText: FileText, Receipt: Receipt
}

export var PERM_GROUPS = [
  { key: 'dashboard',     label: 'Dashboard',         icon: 'LayoutDashboard', perms: ['View'],                                              type: 'System' },
  { key: 'settings',      label: 'Settings',          icon: 'Settings',        perms: ['View', 'Edit'],                                     type: 'System' },
  { key: 'notifications', label: 'Notifications',     icon: 'Bell',            perms: ['View', 'Send'],                                     type: 'System' },
  { key: 'documents',     label: 'Documents',         icon: 'FileText',        perms: ['View', 'Upload', 'Delete'],                          type: 'System' },
  { key: 'location',      label: 'Location Setup',    icon: 'MapPin',          perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Sangh' },
  { key: 'sangh',         label: 'Sangh Management',  icon: 'Users',           perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Sangh' },
  { key: 'members',       label: 'Members & Families', icon: 'Users',          perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Sangh' },
  { key: 'derasar',       label: 'Derasar',           icon: 'Gem',             perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Sangh' },
  { key: 'pathshala',     label: 'Pathshala',         icon: 'BookOpen',        perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Sangh' },
  { key: 'events',        label: 'Events & Festivals', icon: 'CalendarDays',   perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Sangh' },
  { key: 'trust',         label: 'Trust Management',  icon: 'Landmark',        perms: ['View', 'Create', 'Edit', 'Delete'],                   type: 'Trust' },
  { key: 'donations',     label: 'Donations',         icon: 'HandHeart',       perms: ['View', 'Create', 'Edit', 'Delete', 'Export 80G', 'Export'], type: 'Trust' },
  { key: 'accounts',      label: 'Income & Expense',  icon: 'Receipt',         perms: ['View', 'Create', 'Edit', 'Approve'],                  type: 'Trust' },
  { key: 'reports',       label: 'Reports',           icon: 'BarChart3',       perms: ['View', 'Export'],                                   type: 'Trust' },
]

var PERM_LABEL_MAP = {}
function rebuildLabelMap() {
  PERM_LABEL_MAP = {}
  PERM_GROUPS.forEach(function(g) {
    g.perms.forEach(function(p) {
      PERM_LABEL_MAP[g.key + '_' + p.toLowerCase().replace(/\s+/g, '_')] = p
    })
  })
}
rebuildLabelMap()

export function getTotalPerms() {
  return PERM_GROUPS.reduce(function(s, g) { return s + g.perms.length }, 0)
}
export function getAllPermKeys() {
  return PERM_GROUPS.flatMap(function(g) {
    return g.perms.map(function(p) { return g.key + '_' + p.toLowerCase().replace(/\s+/g, '_') })
  })
}
export function getPermsByType(type) {
  return PERM_GROUPS.filter(function(g) { return g.type === type })
}
export function getFullPermKeysForType(type) {
  return getPermsByType(type).flatMap(function(g) {
    return g.perms.map(function(p) { return g.key + '_' + p.toLowerCase().replace(/\s+/g, '_') })
  })
}
export function P(g, a) { return g + '_' + a.toLowerCase().replace(/\s+/g, '_') }

export function getPerms(role) { return role.permissions === 'all' ? getAllPermKeys() : role.permissions }
export function getCount(role) {
  if (role.permissions === 'all') return getTotalPerms()
  return Array.isArray(role.permissions) ? role.permissions.length : 0
}
export function hasPerm(role, key) {
  if (role.permissions === 'all') return true
  return Array.isArray(role.permissions) && role.permissions.indexOf(key) !== -1
}
export function getUserCount(roleId, users) { return users.filter(function(u) { return u.roleId === roleId }).length }

export function permsToNested(perms) {
  if (perms === 'all' || !Array.isArray(perms)) return {}
  var nested = {}
  perms.forEach(function(key) {
    var label = PERM_LABEL_MAP[key]
    if (!label) return
    var group = PERM_GROUPS.find(function(g) {
      return g.perms.some(function(p) { return g.key + '_' + p.toLowerCase().replace(/\s+/g, '_') === key })
    })
    if (!group) return
    if (!nested[group.key]) nested[group.key] = {}
    nested[group.key][label] = true
  })
  return nested
}
export function nestedToPerms(nested) {
  if (!nested || typeof nested !== 'object') return []
  var perms = []
  Object.keys(nested).forEach(function(groupKey) {
    var actions = nested[groupKey]
    if (!actions || typeof actions !== 'object') return
    Object.keys(actions).forEach(function(label) {
      if (actions[label]) {
        var key = groupKey + '_' + label.toLowerCase().replace(/\s+/g, '_')
        if (PERM_LABEL_MAP[key]) perms.push(key)
      }
    })
  })
  return perms
}

export function addPermToGroup(groupKey, permLabel) {
  var group = PERM_GROUPS.find(function(g) { return g.key === groupKey })
  if (!group || group.perms.indexOf(permLabel) !== -1) return false
  group.perms.push(permLabel)
  rebuildLabelMap()
  return true
}
export function updatePermInGroup(groupKey, oldLabel, newLabel) {
  var group = PERM_GROUPS.find(function(g) { return g.key === groupKey })
  if (!group) return false
  var idx = group.perms.indexOf(oldLabel)
  if (idx === -1) return false
  group.perms[idx] = newLabel
  rebuildLabelMap()
  return true
}
export function deletePermFromGroup(groupKey, permLabel) {
  var group = PERM_GROUPS.find(function(g) { return g.key === groupKey })
  if (!group) return false
  var idx = group.perms.indexOf(permLabel)
  if (idx === -1) return false
  group.perms.splice(idx, 1)
  rebuildLabelMap()
  return true
}
export function addPermGroup(key, label, icon, type) {
  if (PERM_GROUPS.find(function(g) { return g.key === key })) return false
  PERM_GROUPS.push({ key: key, label: label, icon: icon || 'Settings', perms: [], type: type || 'System' })
  rebuildLabelMap()
  return true
}
export function deletePermGroup(groupKey) {
  var idx = PERM_GROUPS.findIndex(function(g) { return g.key === groupKey })
  if (idx === -1) return false
  PERM_GROUPS.splice(idx, 1)
  rebuildLabelMap()
  return true
}

export function sortRoles(roles, sortBy, sortDir, users) {
  return roles.slice().sort(function(a, b) {
    var cmp = 0
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortBy === 'type') cmp = a.type.localeCompare(b.type) || a.name.localeCompare(b.name)
    else if (sortBy === 'users') cmp = getUserCount(a.id, users) - getUserCount(b.id, users)
    else if (sortBy === 'perms') cmp = getCount(a) - getCount(b)
    else cmp = a.name.localeCompare(b.name)
    return sortDir === 'asc' ? cmp : -cmp
  })
}

export var INITIAL_ROLES = [
  { id: 1, name: 'Super Admin', type: 'System', description: 'Complete system access — all modules, all actions', status: 'Active', isLocked: true, permissions: 'all' },
  { id: 2, name: 'Trust Admin', type: 'Trust', description: 'Full trust operations, donations, and financial management', status: 'Active', isLocked: false, permissions: getFullPermKeysForType('Trust') },
  { id: 3, name: 'Secretary', type: 'Sangh', description: 'Day-to-day sangh operations, events, and record keeping', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('location','View'), P('sangh','View'), P('sangh','Create'), P('sangh','Edit'), P('trust','View'), P('donations','View'), P('donations','Create'), P('donations','Edit'), P('members','View'), P('members','Create'), P('members','Edit'), P('derasar','View'), P('pathshala','View'), P('events','View'), P('events','Create'), P('reports','View'), P('notifications','View'), P('notifications','Send')] },
  { id: 4, name: 'Manager', type: 'Sangh', description: 'Oversees sangh activities, members, derasar, and pathshala', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('sangh','View'), P('sangh','Create'), P('sangh','Edit'), P('sangh','Delete'), P('trust','View'), P('members','View'), P('members','Create'), P('members','Edit'), P('members','Delete'), P('derasar','View'), P('derasar','Create'), P('derasar','Edit'), P('derasar','Delete'), P('pathshala','View'), P('pathshala','Create'), P('pathshala','Edit'), P('pathshala','Delete'), P('events','View'), P('events','Create'), P('events','Edit'), P('reports','View'), P('notifications','View')] },
  { id: 5, name: 'Accountant', type: 'Trust', description: 'Handles donations, accounting, and financial reports', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('donations','View'), P('donations','Create'), P('donations','Edit'), P('donations','Export 80G'), P('donations','Export'), P('accounts','View'), P('accounts','Create'), P('accounts','Edit'), P('accounts','Approve'), P('members','View'), P('reports','View'), P('reports','Export'), P('notifications','View')] },
  { id: 6, name: 'Committee Member', type: 'Trust', description: 'View-only access for trust oversight and monitoring', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('sangh','View'), P('trust','View'), P('donations','View'), P('accounts','View'), P('reports','View'), P('notifications','View')] },
  { id: 7, name: 'Teacher (Pathshala)', type: 'Sangh', description: 'Manages pathshala students, attendance, and exams', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('pathshala','View'), P('pathshala','Edit'), P('reports','View'), P('notifications','View')] },
  { id: 8, name: 'Poojari', type: 'Sangh', description: 'Manages derasar daily operations and pooja records', status: 'Inactive', isLocked: false, permissions: [P('dashboard','View'), P('derasar','View'), P('derasar','Edit'), P('notifications','View')] },
  { id: 9, name: 'Helper', type: 'System', description: 'Basic view access for data entry and support tasks', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('donations','View'), P('members','View'), P('derasar','View'), P('notifications','View')] },
  { id: 10, name: 'Data Operator', type: 'System', description: 'Bulk data entry across all master modules', status: 'Active', isLocked: false, permissions: [P('dashboard','View'), P('location','View'), P('location','Create'), P('location','Edit'), P('location','Delete'), P('sangh','View'), P('sangh','Create'), P('sangh','Edit'), P('sangh','Delete'), P('trust','View'), P('trust','Create'), P('trust','Edit'), P('members','View'), P('members','Create'), P('members','Edit'), P('donations','View'), P('donations','Create'), P('donations','Edit'), P('derasar','View'), P('derasar','Create'), P('derasar','Edit'), P('pathshala','View'), P('pathshala','Create'), P('pathshala','Edit'), P('documents','View'), P('documents','Upload'), P('reports','View'), P('reports','Export')] },
]

export var INITIAL_USERS = [
  { id: 1, roleId: 1, name: 'Naman Doshi', email: 'naman@jainsangh.com',  phone: '9876543210', status: 'Active', joined: '2024-01-15' },
  { id: 2, roleId: 2, name: 'Rajesh Shah', email: 'rajesh@jainsangh.com', phone: '9876512340', status: 'Active', joined: '2024-02-10' },
  { id: 3, roleId: 3, name: 'Amit Patel',  email: 'amit@jainsangh.com',   phone: '9876534562', status: 'Active', joined: '2024-01-20' },
  { id: 4, roleId: 4, name: 'Mehul Shah',  email: 'mehul@jainsangh.com',  phone: '9876567895', status: 'Active', joined: '2024-03-01' },
  { id: 5, roleId: 5, name: 'Anil Shah',   email: 'anil@jainsangh.com',   phone: '9876589017', status: 'Active', joined: '2024-02-01' },
]