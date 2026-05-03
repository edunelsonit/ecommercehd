import { useState, useEffect } from 'react';
import { Icon, 
} from 'lucide-react';
import api from '../../api/axios';

const StatisticCard = () => {

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeOrders: 0,
        totalRevenue: 0,
        pendingProcurements: 0
    });

  useEffect(() => {
    const fetchAdminData = async () => {
        try {
            const response = await api.get("/api/admin/stats");
            const { data } = response.data;
            
            setStats({
                totalUsers: data.totalUsers,
                activeOrders: data.activeOrders,
                totalRevenue: `₦${data.totalRevenue.toLocaleString()}`,
                pendingDisputes: data.openDisputes
            });
            
            // Map procurement counts for the "Procurement Pipeline" widget
            setStats(data.procurementPipeline);
        } catch (err) {
            console.error("Dashboard data error:", err);
        }
    };
    fetchAdminData();
}, []);


  return (
    <div>
        // --- SUB-COMPONENTS ---

{procurementData.map((item)=>{


})

}
const StatCard = ({ title, value, trend, icon: Icon, color, bg, isAlert }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`${bg} ${color} p-2.5 rounded-lg`}>
        <Icon size={22} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
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


    </div>
  )
}

export default StatisticCard