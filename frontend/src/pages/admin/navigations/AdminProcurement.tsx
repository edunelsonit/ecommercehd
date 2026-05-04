import React, { useState, useEffect } from 'react';
import { 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search,
  Package
} from 'lucide-react';
import api from '../../../api/axios';

const AdminProcurement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        const res = await api.get('/api/admin/procurements');
        setRequests(res.data.data || []);
      } catch (err) {
        console.error("Procurement fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcurements();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      evaluating: "bg-amber-100 text-amber-700 border-amber-200",
      approved: "bg-blue-100 text-blue-700 border-blue-200",
      purchased: "bg-indigo-100 text-indigo-700 border-indigo-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procurement Desk</h1>
          <p className="text-sm text-slate-500">Handle external product requests and customs evaluations.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <Package className="text-indigo-600" size={20} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Pending Review</p>
              <p className="text-lg font-bold leading-none">
                {requests.filter(r => r.status === 'evaluating').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h2 className="font-bold text-slate-800">Incoming Requests</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by User or URL..." 
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Source Link</th>
                <th className="px-6 py-4 font-semibold">Est. Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400">Fetching procurement requests...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-500 italic">No procurement requests found.</td></tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.user?.firstName} {item.user?.surname}</p>
                      <p className="text-xs text-slate-400 tracking-tight">Req ID: #{item.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={item.productUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 text-indigo-600 hover:underline text-sm font-medium"
                      >
                        <ExternalLink size={14} /> View Item
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-900 font-bold">
                        <span className="text-xs mr-0.5">₦</span>
                        {Number(item.finalTotal).toLocaleString()}
                      </div>
                      <p className="text-[10px] text-slate-400">Inc. Service Fee</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Reject">
                          <XCircle size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                          <AlertCircle size={18} />
                        </button>
                      </div>
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

export default AdminProcurement;