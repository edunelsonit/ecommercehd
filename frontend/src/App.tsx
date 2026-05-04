import './App.css'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogistics from './pages/admin/navigations/AdminLogistics'
import AdminOverview from './pages/admin/navigations/AdminOverview'
import AdminProcurement from './pages/admin/navigations/AdminProcurement'
import FinancialModule from './pages/admin/navigations/FinancialModule'
import SupportTicketModule from './pages/admin/navigations/SupportTicketModule'
import UserManagement from './pages/admin/navigations/UserManagement'
import VendorProducts from './pages/admin/navigations/VendorProducts'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/Profile'
import {Routes,Route, Navigate} from 'react-router'

function App() {
  
  return(
    <>
    <Routes>
      <Route index element={ <HomePage/>}/>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="/admin/overview" element={<AdminOverview />}/>
        <Route path="/admin/users" element={<UserManagement />}/>
        <Route path="/admin/products" element={<VendorProducts />}/>
        <Route path="/admin/wallet" element={<FinancialModule />}/>
        <Route path="/admin/logistics" element={<AdminLogistics />}/>
        <Route path="/admin/procurement" element={<AdminProcurement />}/>
        <Route path="/admin/support" element={<SupportTicketModule />}/>
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
    
    </>
    
   

  )
}

export default App
