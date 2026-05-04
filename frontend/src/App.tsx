import "./App.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogistics from "./pages/admin/navigations/AdminLogistics";
import AdminOverview from "./pages/admin/navigations/AdminOverview";
import AdminProcurement from "./pages/admin/navigations/AdminProcurement";
import FinancialModule from "./pages/admin/navigations/FinancialModule";
import SupportTicketModule from "./pages/admin/navigations/SupportTicketModule";
import UserManagement from "./pages/admin/navigations/UserManagement";
import VendorProducts from "./pages/admin/navigations/VendorProducts";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/Profile";
import { Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin" element={<AdminDashboard />}>
          {/* Use 'index' for the default sub-page (Overview) */}
          <Route index element={<AdminOverview />} />

          {/* Use relative paths (no leading slash) */}
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="wallet" element={<FinancialModule />} />
          <Route path="logistics" element={<AdminLogistics />} />
          <Route path="procurement" element={<AdminProcurement />} />
          <Route path="support" element={<SupportTicketModule />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
}

export default App;
