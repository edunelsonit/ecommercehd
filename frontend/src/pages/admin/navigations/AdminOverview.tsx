
import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  Wallet,
  Truck,
  Globe,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import api from "../../../api/axios";
// Assuming 'api' is your axios instance
// import api from '../utils/api';


const AdminOverview = () => {
  const [overviewresult, getOverviewResult] = useState();
  const [recentOrders, setRecentOrders] = useState([]);


  useEffect(() => {
    const getAdminOverView = async () => {
      try {
        const response = await api.get("/api/admin/stats");
        getOverviewResult(response.data.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };
    getAdminOverView();

    const fetchRecentOrders = async () => {
      try {
        const response = await api.get("/api/admin/recent-orders");
        setRecentOrders(response.data.data);
      } catch (err) {
        console.error("Error fetching recent orders:", err);
      }
    };
    fetchRecentOrders();
  }, []); // Empty array means "run once on mount"

  // Helper to find specific counts in the procurement array
  const getPCount = (status) => {
    return (
      overviewresult?.procurementPipeline?.find((p) => p.status === status)
        ?.count || 0
    );
  };

  // Helper to style status badges based on Prisma Enum
  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-indigo-100 text-indigo-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };
  return (
    <div>

          {/* DASHBOARD CONTENT */}
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Platform Overview
                </h1>
                <p className="text-slate-500">
                  Welcome back. Here is what's happening today.
                </p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm shadow-indigo-200">
                <Plus size={18} /> Create New Product
              </button>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`₦${Number(overviewresult?.totalRevenue || 0).toLocaleString()}`}
                trend="+12.5%"
                icon={Wallet}
                color="text-emerald-600"
                bg="bg-emerald-50"
                isAlert={false}
              />
              <StatCard
                title="Active Orders"
                value={overviewresult?.activeOrders || 0}
                trend="+3.2%"
                icon={ShoppingBag}
                color="text-blue-600"
                bg="bg-blue-50"
                isAlert={false}
              />
              <StatCard
                title="Total Customers"
                value={overviewresult?.totalUsers || 0}
                trend="+18.7%"
                icon={Users}
                color="text-indigo-600"
                bg="bg-indigo-50"
                isAlert={false}
              />
              <StatCard
                title="Pending Disputes"
                value={overviewresult?.openDisputes || 0}
                trend="-2.4%"
                icon={AlertCircle}
                color="text-amber-600"
                bg="bg-amber-50"
                isAlert={true}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* RECENT ORDERS TABLE */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Recent Orders</h3>
                  <button className="text-indigo-600 text-sm font-semibold hover:underline">
                    View All
                  </button>
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
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 font-mono text-slate-600">
                              #ORD-{order.id.toString().padStart(5, "0")}
                            </td>
                            <td className="px-6 py-4 text-slate-900 font-medium">
                              {order.user?.firstName} {order.user?.surname}
                              <span className="block text-xs text-slate-400 font-normal">
                                {order.user?.email}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              ₦{Number(order.totalAmount).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(order.orderStatus)}`}
                              >
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() =>
                                  (window.location.href = `/admin/orders/${order.id}`)
                                }
                                className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-indigo-600"
                              >
                                <ArrowUpRight size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-10 text-center text-slate-400"
                          >
                            No recent orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PROCUREMENT STATUS */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-6">
                  Procurement Pipeline
                </h3>
                <div className="space-y-6">
                  <StatusItem
                    label="Evaluating Requests"
                    count={getPCount("evaluating")}
                    icon={Globe}
                    color="bg-blue-500"
                  />
                  <StatusItem
                    label="Approved"
                    count={getPCount("approved")}
                    icon={CheckCircle2}
                    color="bg-emerald-500"
                  />
                  <StatusItem
                    label="Purchased"
                    count={getPCount("purchased")}
                    icon={ShoppingBag}
                    color="bg-indigo-500"
                  />
                  <StatusItem
                    label="Shipped"
                    count={getPCount("shipped")}
                    icon={Truck}
                    color="bg-amber-500"
                  />
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-xs text-slate-400 mb-4 font-medium italic">
                    All international shipping rates are up to date.
                  </p>
                  <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
                    Check Customs Rates
                  </button>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}

const StatCard = ({ title, value, trend, icon: Icon, color, bg, isAlert }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`${bg} ${color} p-2.5 rounded-lg`}>
        <Icon size={22} />
      </div>
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith("+") ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
      >
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
  </div>
);

const StatusItem = ({ label, count, icon: Icon, color }) => (
  <div className="flex items-center gap-4">
    <div className={`w-2 h-10 rounded-full ${color}`}></div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800">{label}</p>
      <p className="text-xs text-slate-500">Active Requests</p>
    </div>
    <span className="text-lg font-bold text-slate-900">{count}</span>
  </div>
);


export default AdminOverview