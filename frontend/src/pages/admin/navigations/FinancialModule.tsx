import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  Activity, 
  Download,
  Filter,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import api from '../../../api/axios';

const FinancialModule = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalInflow: 0,
    totalOutflow: 0
  });

  useEffect(() => {
    const fetchFinancials = async () => {
      try {
        const res = await api.get('/api/admin/financials');
        setTransactions(res.data.transactions || []);
        setSummary(res.data.summary || { totalBalance: 0, totalInflow: 0, totalOutflow: 0 });
      } catch (err) {
        console.error("Financial data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Ledger</h1>
          <p className="text-sm text-slate-500">Monitor platform-wide wallets, commissions, and payouts.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinCard 
          label="Total Escrow Balance" 
          value={summary.totalBalance} 
          icon={<Wallet className="text-indigo-600" />} 
          trend="+12% vs last month"
          color="indigo" 
        />
        <FinCard 
          label="Total Revenue" 
          value={summary.totalInflow} 
          icon={<TrendingUp className="text-emerald-600" />} 
          trend="+5.4% today"
          color="emerald" 
        />
        <FinCard 
          label="Pending Payouts" 
          value={summary.totalOutflow} 
          icon={<CreditCard className="text-rose-600" />} 
          trend="8 requests waiting"
          color="rose" 
        />
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" />
            Recent Transactions
          </h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4 font-semibold">Reference / Date</th>
                <th className="px-6 py-4 font-semibold">User/Entity</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400">Loading ledger data...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" className="py-20 text-center text-slate-400 italic">No transactions recorded.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-slate-700">{tx.reference || `TXN-${tx.id}`}</p>
                      <p className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {tx.wallet?.user?.firstName || 'System Account'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? (
                          <ArrowDownLeft size={14} className="text-emerald-500" />
                        ) : (
                          <ArrowUpRight size={14} className="text-rose-500" />
                        )}
                        <span className="text-xs font-bold text-slate-700">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        ₦{Number(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                        tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {tx.status}
                      </span>
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

// Internal Card Component
const FinCard = ({ label, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${color}-50 rounded-full transition-transform group-hover:scale-110`} />
    <div className="relative">
      <div className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 mt-1">₦{Number(value).toLocaleString()}</h3>
      <p className="text-xs mt-2 font-medium text-slate-400">{trend}</p>
    </div>
  </div>
);

export default FinancialModule;