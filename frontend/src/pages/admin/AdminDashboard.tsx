import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Wallet,
  Truck,
  LifeBuoy,
  Globe,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "User Management", icon: Users, path: "/admin/users" },
    { name: "Products & Vendors", icon: ShoppingBag, path: "/admin/products" },
    { name: "Financials", icon: Wallet, path: "/admin/wallet" },
    { name: "Logistics", icon: Truck, path: "/admin/logistics" },
    { name: "Procurement", icon: Globe, path: "/admin/procurement" },
    { name: "Support Tickets", icon: LifeBuoy, path: "/admin/support" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* --- SIDEBAR --- */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight">MarketAdmin</span>
          )}
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              {isSidebarOpen && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="p-6 border-t border-slate-800 flex items-center gap-4 text-red-400 hover:bg-slate-800 transition-colors"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <div className="relative w-96 hidden md:block">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Superadmin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT CONTAINER */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;