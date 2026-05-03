import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, Wallet, 
  Truck, LifeBuoy, Globe, Bell, 
  Search, AlertCircle, CheckCircle2,
  Menu, X, LogOut, ArrowUpRight, Plus
} from 'lucide-react';
import api from '../../api/axios';
// Assuming 'api' is your axios instance
// import api from '../utils/api';

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin', active: true },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Products & Vendors', icon: ShoppingBag, path: '/admin/products' },
    { name: 'Financials', icon: Wallet, path: '/admin/wallet' },
    { name: 'Logistics', icon: Truck, path: '/admin/logistics' },
    { name: 'Procurement', icon: Globe, path: '/admin/procurement' },
    { name: 'Support Tickets', icon: LifeBuoy, path: '/admin/support' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* --- SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col fixed h-full z-50`}>
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">MarketAdmin</span>}
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                item.active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-4 px-3 py-3 w-full hover:bg-slate-800 rounded-lg text-red-400 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
              {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
            <div className="relative w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders, users, or transactions..." 
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Superadmin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
              <p className="text-slate-500">Welcome back. Here is what's happening today.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
              <Plus size={18} /> Create New Product
            </button>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value="₦4,250,000" trend="+12.5%" icon={Wallet} color="text-emerald-600" bg="bg-emerald-50" isAlert={false} />
            <StatCard title="Active Orders" value="156" trend="+3.2%" icon={ShoppingBag} color="text-blue-600" bg="bg-blue-50" isAlert={false} />
            <StatCard title="New Customers" value="48" trend="+18.7%" icon={Users} color="text-indigo-600" bg="bg-indigo-50" isAlert={false} />
            <StatCard title="Pending Disputes" value="12" trend="-2.4%" icon={AlertCircle} color="text-amber-600" bg="bg-amber-50" isAlert={true} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* RECENT ORDERS TABLE */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Orders</h3>
                <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-600">#ORD-9421{i}</td>
                        <td className="px-6 py-4 text-slate-900 font-medium">John Doe</td>
                        <td className="px-6 py-4 text-slate-600">₦24,500.00</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Processing</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400">
                            <ArrowUpRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PROCUREMENT STATUS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6">Procurement Pipeline</h3>
              <div className="space-y-6">
                <StatusItem label="Evaluating Requests" count={8} icon={Globe} color="bg-blue-500" />
                <StatusItem label="Awaiting Payment" count={14} icon={Wallet} color="bg-amber-500" />
                <StatusItem label="In Transit (Intl)" count={5} icon={Truck} color="bg-indigo-500" />
                <StatusItem label="Delivered" count={42} icon={CheckCircle2} color="bg-emerald-500" />
              </div>
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 mb-4 font-medium italic">All international shipping rates are up to date.</p>
                <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
                  Check Customs Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;