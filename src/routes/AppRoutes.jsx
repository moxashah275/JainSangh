import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/dashboard/Dashboard'
import MastersList from '../pages/masters/MastersList'
import Location from '../pages/masters/Location'
import Sangh from '../pages/masters/Sangh'
import Trust from '../pages/masters/Trust'
import RolesAndPermissionsPage from '../pages/RolesAndPermissions/RolesAndPermissionsPage'
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
import DonationReport from '../pages/reports/DonationReport'
import ExpenseReport from '../pages/reports/ExpenseReport'
import Analytics from '../pages/reports/Analytics'
import Notifications from '../pages/notifications/Notifications'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="masters" element={<MastersList />} />
        <Route path="masters/location" element={<Location />} />
        <Route path="masters/sangh" element={<Sangh />} />
        <Route path="masters/trust" element={<Trust />} />
        <Route path="roles" element={<RolesAndPermissionsPage />} />
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
        <Route path="reports/donations" element={<DonationReport />} />
        <Route path="reports/expenses" element={<ExpenseReport />} />
        <Route path="reports/analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}