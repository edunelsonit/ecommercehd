import { useState, useEffect } from "react";
import {
  Tag,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Box,
} from "lucide-react";
import api from "../../api/axios";
import AddProductModal from "./modals/AddProductModal";

const VendorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorData, setVendorData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await api.get("/api/vendor/profile");
        setVendorData(res.data.vendor);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Vendor fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, []);

  return (
    <div className="space-y-6 p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {vendorData?.businessName || "Merchant"} Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Manage your shop, inventory, and track your earnings.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <VendorStat
          icon={<TrendingUp className="text-emerald-500" />}
          label="Total Sales"
          value={`₦${vendorData?.totalSales || 0}`}
        />
        <VendorStat
          icon={<Box className="text-indigo-500" />}
          label="Active Products"
          value={products.length}
        />
        <VendorStat
          icon={<AlertCircle className="text-rose-500" />}
          label="Low Stock Alert"
          value={products.filter((p) => p.stockThreshold > 10).length} // Logic based on your schema stock_threshold
        />
      </div>

      {/* Product Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Your Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    Loading inventory...
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Tag className="text-slate-400" size={18} />
                        </div>
                        <p className="font-bold text-slate-800">
                          {product.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.category?.name}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₦{Number(product.basePrice).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                          product.isAvailable
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}
                      >
                        {product.isAvailable ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                          <Trash2 size={16} />
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

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={vendorData} // Function that re-fetches products
      />
    </div>
  );
};

const VendorStat = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-slate-50">{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-xl font-black text-slate-900">{value}</h3>
    </div>
  </div>
);

export default VendorDashboard;
