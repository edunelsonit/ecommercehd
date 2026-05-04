import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Store,
  Mail,
} from "lucide-react";
import api from "../../../api/axios";
import AddVendorModal from "./AddVendorModal";

// Define an interface if using TypeScript, or just remove types for JS
interface Vendor {
  id: string;
  businessName: string;
  email: string;
  category: string;
  vendorType: string;
  isCacRegistered: boolean;
  cacNumber?: string | number;
  status: 'active' | 'pending' | 'suspended';
}

const VendorProducts = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use a ref to track mounting status to prevent state updates on unmounted component
  const isMounted = useRef(true);

  // 1. Fetch Vendors List - Wrapped in useCallback so it's a stable dependency
  const fetchVendorsList = useCallback(async () => {
    try {
      const response = await api.get("/api/admin/vendors");
      if (isMounted.current) {
        setVendors(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // 2. Initial Data Load
  useEffect(() => {
    isMounted.current = true;
    
    const loadInitialData = async () => {
      setLoading(true);
      await fetchVendorsList();
    };

    loadInitialData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchVendorsList]);

  // 3. Derived State: Filter logic (Always do this in the render body, not an effect)
  const filteredVendors = vendors.filter(vendor => 
    vendor.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendors & Products</h1>
          <p className="text-slate-500 text-sm">Manage marketplace sellers and registration status.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
        >
          <Plus size={18} />
          Add New Vendor
        </button>
      </div>

      {/* FILTERS & STATS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search business name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filters
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
          <p className="text-sm text-slate-500">
            Total Vendors: <span className="font-bold text-slate-900">{vendors.length}</span>
          </p>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Business Details</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Category / Type</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">CAC Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-6">
                       <div className="h-10 bg-slate-100 rounded-lg animate-pulse w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Store size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{vendor.businessName}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail size={12}/> {vendor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{vendor.category}</p>
                      <p className="text-xs text-slate-400">{vendor.vendorType}</p>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.isCacRegistered ? (
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle size={14} /> Registered
                          </span>
                          <span className="text-[10px] text-slate-400">RC: {vendor.cacNumber}</span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                          <XCircle size={14} /> Unregistered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        vendor.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        vendor.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    No vendors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL COMPONENT */}
      <AddVendorModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onRefresh={fetchVendorsList}
      />
    </div>
  );
};

export default VendorProducts;