import { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  Search,
  User,
  ExternalLink
} from 'lucide-react';
import api from '../../../api/axios';

const SupportTicketModule = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await api.get('/api/admin/disputes');
        setDisputes(res.data.data || []);
      } catch (err) {
        console.error("Dispute fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-rose-100 text-rose-700 border-rose-200",
      reviewing: "bg-amber-100 text-amber-700 border-amber-200",
      resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
      rejected: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispute Resolution Center</h1>
          <p className="text-sm text-slate-500">Manage order conflicts, refunds, and customer complaints.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                A{i}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">3 Admins Active</p>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <AlertTriangle size={16} />
            <span className="text-xs font-bold uppercase">Critical</span>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {disputes.filter(d => d.status === 'open').length}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Unresolved Disputes</p>
        </div>
        {/* Additional stat cards can go here */}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by Order ID or User..." 
              className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 font-semibold">Ticket Info</th>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Issue/Reason</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400">Loading disputes...</td></tr>
              ) : disputes.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400 italic">No disputes reported.</td></tr>
              ) : (
                disputes.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 underline decoration-rose-200">#{ticket.id}</span>
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                        Order #{ticket.orderId} <ExternalLink size={10} />
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                          <User size={14} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{ticket.user?.firstName}</p>
                          <p className="text-[10px] text-slate-400">{ticket.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 line-clamp-1 max-w-[200px]" title={ticket.reason}>
                        {ticket.reason}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-tight ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all">
                        Resolve
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

export default SupportTicketModule;