import { INITIAL_ROLES } from '../RolesAndPermissions/roleData'

export var INITIAL_USERS = [
  { id: 1, name: 'Naman Doshi', email: 'naman@jainsangh.com', phone: '9876543210', trustId: 1, sanghId: 1, departmentId: null, roleId: 1, permissions: [], status: 'Active', joined: '2024-01-15', lastLogin: '2025-06-14 10:30', notes: 'Super Admin - Full access' },
  { id: 2, name: 'Rajesh Shah', email: 'rajesh@jainsangh.com', phone: '9876512340', trustId: 1, sanghId: 1, departmentId: null, roleId: 2, permissions: [], status: 'Active', joined: '2024-02-10', lastLogin: '2025-06-13 09:00', notes: 'Trust Admin' },
  { id: 3, name: 'Amit Patel', email: 'amit@jainsangh.com', phone: '9876534562', trustId: 1, sanghId: 2, departmentId: 1, roleId: 3, permissions: [], status: 'Active', joined: '2024-01-20', lastLogin: '2025-06-12 14:00', notes: 'Secretary' },
  { id: 4, name: 'Mehul Shah', email: 'mehul@jainsangh.com', phone: '9876567895', trustId: 1, sanghId: 1, departmentId: null, roleId: 4, permissions: [], status: 'Active', joined: '2024-03-01', lastLogin: '2025-06-11 11:30', notes: 'Manager' },
  { id: 5, name: 'Anil Shah', email: 'anil@jainsangh.com', phone: '9876589017', trustId: 2, sanghId: 3, departmentId: 6, roleId: 5, permissions: ['donations_add', 'accounts_view'], status: 'Active', joined: '2024-02-01', lastLogin: '2025-06-10 08:45', notes: 'Accountant with extra donation permission' },
  { id: 6, name: 'Suresh Jain', email: 'suresh@jainsangh.com', phone: '9876601234', trustId: 1, sanghId: 2, departmentId: null, roleId: 6, permissions: [], status: 'Active', joined: '2024-04-15', lastLogin: '2025-06-09 16:00', notes: 'Committee Member' },
  { id: 7, name: 'Bhavik Mehta', email: 'bhavik@jainsangh.com', phone: '9876623456', trustId: 3, sanghId: 5, departmentId: 3, roleId: 7, permissions: [], status: 'Active', joined: '2024-05-10', lastLogin: '2025-06-08 10:00', notes: 'Pathshala Teacher' },
  { id: 8, name: 'Karan Desai', email: 'karan@jainsangh.com', phone: '9876645678', trustId: 1, sanghId: 4, departmentId: 1, roleId: 8, permissions: [], status: 'Inactive', joined: '2024-03-20', lastLogin: '2025-05-20 12:00', notes: 'Poojari - on leave' },
  { id: 9, name: 'Jayesh Patel', email: 'jayesh@jainsangh.com', phone: '9876667890', trustId: 2, sanghId: 3, departmentId: 2, roleId: 9, permissions: [], status: 'Active', joined: '2024-06-01', lastLogin: '2025-06-14 09:30', notes: 'Helper' },
  { id: 10, name: 'Prakash Soni', email: 'prakash@jainsangh.com', phone: '9876689012', trustId: 1, sanghId: 1, departmentId: null, roleId: 10, permissions: [], status: 'Active', joined: '2024-01-25', lastLogin: '2025-06-13 15:00', notes: 'Data Operator' },
  { id: 11, name: 'Ravi Mehta', email: 'ravi@jainsangh.com', phone: '9876701234', trustId: 1, sanghId: 2, departmentId: 4, roleId: 4, permissions: [], status: 'Active', joined: '2024-07-10', lastLogin: '2025-06-12 11:00', notes: 'Chhatralay Manager' },
  { id: 12, name: 'Dinesh Jain', email: 'dinesh@jainsangh.com', phone: '9876723456', trustId: 2, sanghId: 3, departmentId: 5, roleId: 5, permissions: [], status: 'Suspended', joined: '2024-02-15', lastLogin: '2025-04-10 10:00', notes: 'Donation Accountant - suspended pending review' },
  { id: 13, name: 'Harsh Patel', email: 'harsh@jainsangh.com', phone: '9876745678', trustId: 3, sanghId: 5, departmentId: 3, roleId: 7, permissions: [], status: 'Active', joined: '2024-08-01', lastLogin: '2025-06-14 08:00', notes: 'Pathshala Teacher' },
  { id: 14, name: 'Vipul Shah', email: 'vipul@jainsangh.com', phone: '9876767890', trustId: 1, sanghId: 1, departmentId: null, roleId: 6, permissions: [], status: 'Active', joined: '2024-09-15', lastLogin: '2025-06-11 14:30', notes: 'Committee Member' },
  { id: 15, name: 'Chirag Desai', email: 'chirag@jainsangh.com', phone: '9876789012', trustId: 1, sanghId: 4, departmentId: null, roleId: 9, permissions: [], status: 'Active', joined: '2024-10-01', lastLogin: '2025-06-10 09:00', notes: 'Helper - Event support' }
]

export var INITIAL_USER_DOCS = [
  { id: 1, userId: 1, type: 'Aadhaar', fileName: 'aadhaar_naman.pdf', status: 'Approved', uploadedDate: '2024-01-15', uploadedBy: 'Naman Doshi', notes: '' },
  { id: 2, userId: 1, type: 'PAN', fileName: 'pan_naman.pdf', status: 'Approved', uploadedDate: '2024-01-15', uploadedBy: 'Naman Doshi', notes: '' },
  { id: 3, userId: 2, type: 'Appointment Letter', fileName: 'appt_rajesh.pdf', status: 'Approved', uploadedDate: '2024-02-10', uploadedBy: 'Naman Doshi', notes: 'Trustee appointment' },
  { id: 4, userId: 5, type: 'Aadhaar', fileName: 'aadhaar_anil.pdf', status: 'Pending', uploadedDate: '2024-02-01', uploadedBy: 'Anil Shah', notes: '' },
  { id: 5, userId: 5, type: 'Joining Letter', fileName: 'joining_anil.pdf', status: 'Approved', uploadedDate: '2024-02-01', uploadedBy: 'Rajesh Shah', notes: '' },
  { id: 6, userId: 12, type: 'Aadhaar', fileName: 'aadhaar_dinesh.pdf', status: 'Rejected', uploadedDate: '2024-02-15', uploadedBy: 'Dinesh Jain', notes: 'Blurry document' }
]

export var INITIAL_ACTIVITIES = [
  { id: 1, userId: 1, action: 'created', description: 'User account created as Super Admin', doneBy: 'System', date: '2024-01-15 09:00' },
  { id: 2, userId: 2, action: 'created', description: 'User account created as Trust Admin', doneBy: 'Naman Doshi', date: '2024-02-10 10:00' },
  { id: 3, userId: 5, action: 'permission_change', description: 'Extra permissions added: donations_add, accounts_view', doneBy: 'Naman Doshi', date: '2024-03-15 14:00' },
  { id: 4, userId: 8, action: 'status_change', description: 'Status changed from Active to Inactive', doneBy: 'Rajesh Shah', date: '2025-05-20 12:00' },
  { id: 5, userId: 12, action: 'status_change', description: 'Status changed from Active to Suspended', doneBy: 'Naman Doshi', date: '2025-04-10 10:00' },
  { id: 6, userId: 1, action: 'login', description: 'User logged in', doneBy: 'Naman Doshi', date: '2025-06-14 10:30' },
  { id: 7, userId: 3, action: 'role_change', description: 'Role changed from Committee Member to Secretary', doneBy: 'Naman Doshi', date: '2024-06-01 11:00' },
  { id: 8, userId: 5, action: 'doc_upload', description: 'Aadhaar document uploaded', doneBy: 'Anil Shah', date: '2024-02-01 10:30' }
]

export function getRoleName(roleId) {
  var r = INITIAL_ROLES.find(function(role) { return role.id === roleId })
  return r ? r.name : '-'
}

export function getRole(roleId) {
  return INITIAL_ROLES.find(function(role) { return role.id === roleId })
}

export function getDocCount(userId, docs) {
  return (docs || []).filter(function(d) { return d.userId === userId }).length
}

export function getUserDocs(userId, docs) {
  return (docs || []).filter(function(d) { return d.userId === userId })
}

export function getUserActivities(userId, activities) {
  return (activities || []).filter(function(a) { return a.userId === userId }).sort(function(a, b) { return new Date(b.date) - new Date(a.date) })
}

export function getStatusCounts(users) {
  var counts = { Active: 0, Inactive: 0, Suspended: 0, Deleted: 0, Total: 0 }
  ;(users || []).forEach(function(u) { counts[u.status] = (counts[u.status] || 0) + 1; counts.Total++ })
  return counts
}

export function getUsersByRole(roleId, users) {
  return (users || []).filter(function(u) { return u.roleId === roleId })
}

export function getUsersByTrust(trustId, users) {
  return (users || []).filter(function(u) { return u.trustId === trustId })
}

export function getUsersBySangh(sanghId, users) {
  return (users || []).filter(function(u) { return u.sanghId === sanghId })
}