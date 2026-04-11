import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/dashboard/Dashboard'
import OrgOverview from '../pages/organization/OrgOverview'
import Trust from '../pages/organization/Trust'
import Sangh from '../pages/organization/Sangh'
import Departments from '../pages/organization/Departments'
import Location from '../pages/organization/Location'
import UserList from '../pages/users/UserList'
import UserDocumentsPage from '../pages/users/UserDocumentsPage'
import RolesAndPermissionsPage from '../pages/RolesAndPermissions/RolesAndPermissionsPage'
import Managers from '../pages/staff/Managers'
import Accountants from '../pages/staff/Accountants'
import Helpers from '../pages/staff/Helpers'
import Volunteers from '../pages/staff/Volunteers'
import CommitteeMembers from '../pages/committee/CommitteeMembers'
import DonationList from '../pages/donations/DonationList'
import AddDonation from '../pages/donations/AddDonation'
import EditDonation from '../pages/donations/EditDonation'
import Receipt from '../pages/donations/Receipt'
import DerasarList from '../pages/derasar/DerasarList'
import Salgirah from '../pages/derasar/Salgirah'
import Poojari from '../pages/derasar/Poojari'
import Pratima from '../pages/derasar/Pratima'
import Students from '../pages/pathshala/Students'
import Teachers from '../pages/pathshala/Teachers'
import Exams from '../pages/pathshala/Exams'
import Results from '../pages/pathshala/Results'
import Analytics from '../pages/reports/Analytics'
import DonationReport from '../pages/reports/DonationReport'
import ExpenseReport from '../pages/reports/ExpenseReport'
import UserReport from '../pages/reports/UserReport'
import Notifications from '../pages/notifications/Notifications'
import Accounts from '../pages/accounts/Accounts'
import Income from '../pages/accounts/Income'
import Expense from '../pages/accounts/Expense'
import Settings from '../pages/settings/Settings'
import Profile from '../pages/settings/Profile'
import Permissions from '../pages/settings/Permissions'
import SanghAdminDashboard from '../pages/sanghAdmin/SanghAdminDashboard'
import SanghDetails from '../pages/sanghAdmin/mySangh/SanghDetails'

import { ROLES } from '../config/roles'
import { ProtectedRoute, RoleGuard } from '../components/auth/Guards'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        
        {/* SUPER ADMIN PROTECTED ROUTES */}
        <Route element={<RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="organization" element={<OrgOverview />} />
        <Route path="organization/trust" element={<Trust />} />
        <Route path="organization/sangh" element={<Sangh />} />
        <Route path="organization/departments" element={<Departments />} />
        <Route path="organization/location" element={<Location />} />
        <Route path="location" element={<Navigate to="/organization/location" replace />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<Navigate to="/users" replace />} />
        <Route path="users/:id/documents" element={<UserDocumentsPage />} />
        <Route path="roles" element={<RolesAndPermissionsPage />} />
        <Route path="staff/managers" element={<Managers />} />
        <Route path="staff/accountants" element={<Accountants />} />
        <Route path="staff/helpers" element={<Helpers />} />
        <Route path="staff/volunteers" element={<Volunteers />} />
        <Route path="committee" element={<CommitteeMembers />} />
        <Route path="donations" element={<DonationList />} />
        <Route path="donations/add" element={<AddDonation />} />
        <Route path="donations/edit/:id" element={<EditDonation />} />
        <Route path="donations/receipt/:id" element={<Receipt />} />
        <Route path="derasar" element={<DerasarList />} />
        <Route path="derasar/salgirah" element={<Salgirah />} />
        <Route path="derasar/poojari" element={<Poojari />} />
        <Route path="derasar/pratima" element={<Pratima />} />
        <Route path="pathshala/students" element={<Students />} />
        <Route path="pathshala/teachers" element={<Teachers />} />
        <Route path="pathshala/exams" element={<Exams />} />
        <Route path="pathshala/results" element={<Results />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="accounts/income" element={<Income />} />
        <Route path="accounts/expense" element={<Expense />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/profile" element={<Profile />} />
        <Route path="settings/permissions" element={<Permissions />} />
        <Route path="reports/analytics" element={<Analytics />} />
        <Route path="reports/donations" element={<DonationReport />} />
        <Route path="reports/expenses" element={<ExpenseReport />} />
        <Route path="reports/users" element={<UserReport />} />
        <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Route>

      {/* SANGH ADMIN PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard allowedRoles={[ROLES.SANGH_ADMIN]} />}>
          <Route path="/sangh-admin" element={<Layout />}>
            <Route index element={<SanghAdminDashboard />} />
            <Route path="my-sangh/details" element={<SanghDetails />} />
          </Route>
        </Route>
      </Route>
      
    </Routes>
  )
}
