import { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle, Clock, Search, Filter, Navigation } from 'lucide-react';
import api from '../../../api/axios';

const AdminLogistics = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchLogistics = async () => {
      try {
        const res = await api.get('/api/admin/logistics');
        setDeliveries(res.data.data || []);
        
        // Simple stats calculation
        const data = res.data.data || [];
        setStats({
          active: data.filter(d => d.status === 'in_transit' || d.status === 'picked_up').length,
          pending: data.filter(d => d.status === 'assigned').length,
          completed: data.filter(d => d.status === 'delivered').length,
        });
      } catch (err) {
        console.error("Logistics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogistics();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'picked_up': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Logistics Overview</h1>
          <p className="text-sm text-slate-500">Real-time tracking of all active and pending deliveries.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-md">
            Assign Rider
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Clock className="text-amber-500" />} label="Pending Pickup" value={stats.pending} color="amber" />
        <StatCard icon={<Truck className="text-blue-500" />} label="In Transit" value={stats.active} color="blue" />
        <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Completed Today" value={stats.completed} color="emerald" />
      </div>

      {/* Delivery Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Active Shipments</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              className="pl-10 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Order / ID</th>
                <th className="px-6 py-4 font-semibold">Rider Details</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="py-10 text-center text-slate-400">Loading logistics data...</td></tr>
              ) : deliveries.length === 0 ? (
                <tr><td colSpan="5" className="py-10 text-center text-slate-400 italic">No active deliveries found.</td></tr>
              ) : (
                deliveries.map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">Order #{delivery.orderId}</p>
                      <p className="text-xs text-slate-400">{new Date(delivery.assignedAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {delivery.rider?.firstName?.[0] || 'R'}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{delivery.rider?.firstName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <MapPin size={14} className="text-rose-500" />
                        <span className="truncate max-w-[150px]">{delivery.order?.landmarkAddress || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusStyle(delivery.status)}`}>
                        {delivery.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors">
                        <Navigation size={18} className="hover:text-indigo-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-component for Stats
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-${color}-50`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
    </div>
  </div>
);

export default AdminLogistics;