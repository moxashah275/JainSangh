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
import RolesAndPermissions from '../pages/RolesAndPermissions/RolesAndPermissionsPage'
import Notifications from '../pages/notifications/Notifications'

// Admin - Institutions
import DerasarList from '../pages/derasar/DerasarList'
import Salgirah from '../pages/derasar/Salgirah'
import Poojari from '../pages/derasar/Poojari'
import Pratima from '../pages/derasar/Pratima'

// Auth & Guards
import { ProtectedRoute, RoleGuard } from '../components/auth/Guards'
import { ROLES } from '../config/roles'

// Sangh Admin Pages
import SanghAdminDashboard from '../pages/sanghAdmin/SanghAdminDashboard'
import SanghDetails from '../pages/sanghAdmin/mySangh/SanghDetails'
import LinkedTrusts from '../pages/sanghAdmin/mySangh/LinkedTrusts'
import SanghCommitteeMembers from '../pages/sanghAdmin/mySangh/CommitteeMembers'
import Members from '../pages/sanghAdmin/members/Members'
import Derasar from '../pages/sanghAdmin/institutions/Derasar'
import Pathshala from '../pages/sanghAdmin/institutions/Pathshala'
import AyambliShala from '../pages/sanghAdmin/institutions/AyambliShala'
import Upashray from '../pages/sanghAdmin/institutions/Upashray'
import Login from '../pages/auth/Login'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* SUPER ADMIN ROUTES */}
        <Route element={<RoleGuard allowedRoles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="organization" element={<OrgOverview />} />
            <Route path="organization/trust" element={<Trust />} />
            <Route path="organization/sangh" element={<Sangh />} />
            <Route path="organization/sangh/:id" element={<SanghDetails />} />
            <Route path="organization/departments" element={<Departments />} />
            <Route path="locations" element={<Location />} />
            
            <Route path="users" element={<UserList />} />
            <Route path="users/documents" element={<UserDocumentsPage />} />
            <Route path="roles" element={<RolesAndPermissions />} />
            
            <Route path="derasar" element={<DerasarList />} />
            <Route path="derasar/salgirah" element={<Salgirah />} />
            <Route path="derasar/poojari" element={<Poojari />} />
            <Route path="derasar/pratima" element={<Pratima />} />

            <Route path="notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        {/* SANGH ADMIN ROUTES */}
        <Route element={<RoleGuard allowedRoles={[ROLES.SANGH_ADMIN]} />}>
          <Route path="/sangh-admin" element={<Layout />}>
            <Route index element={<SanghAdminDashboard />} />
            <Route path="my-sangh/details" element={<SanghDetails />} />
            <Route path="my-sangh/linked-trusts" element={<LinkedTrusts />} />
            <Route path="my-sangh/committee" element={<SanghCommitteeMembers />} />
            <Route path="members" element={<Members />} />
            <Route path="institutions/derasar" element={<Derasar />} />
            <Route path="institutions/Pathshala" element={<Pathshala />} />
            <Route path="institutions/aayambil" element={<AyambliShala />} />
            <Route path="institutions/upasray" element={<Upashray />} />
          </Route>
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  )
}