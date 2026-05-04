import React, { useState, useEffect } from 'react';
import { X, Loader2, Building2 } from 'lucide-react';
import api from '../../../api/axios';

const AddVendorModal = ({ isOpen, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // To select an existing user
  const [formData, setFormData] = useState({
    userId: '',
    businessName: '',
    vendorType: 'Retailer',
    email: '',
    phone: '',
    category: 'Electronics',
    address: '',
    isCacRegistered: false,
    cacNumber: ''
  });

  // Fetch users who aren't vendors yet (Simplified)
  useEffect(() => {
    if (isOpen) {
      api.get('/api/admin/users?role=customer').then(res => setUsers(res.data.data));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/admin/vendors', formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating vendor");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Building2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Create Vendor Profile</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Associate User ID</label>
              <input
                required
                type="number"
                placeholder="Enter User ID to promote to Vendor"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
              />
            </div>

            {/* Business Details */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name</label>
              <input
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Vendor Type</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.vendorType}
                onChange={(e) => setFormData({...formData, vendorType: e.target.value})}
              >
                <option value="Manufacturer">Manufacturer</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Retailer">Retailer</option>
              </select>
            </div>

            {/* Contact Details */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Email</label>
              <input
                required type="email"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <input
                required type="tel"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            {/* CAC Verification Section */}
            <div className="md:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-700">Is CAC Registered?</span>
                <input 
                  type="checkbox"
                  className="w-5 h-5 accent-indigo-600"
                  checked={formData.isCacRegistered}
                  onChange={(e) => setFormData({...formData, isCacRegistered: e.target.checked})}
                />
              </div>
              {formData.isCacRegistered && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">CAC RC Number</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.cacNumber}
                    onChange={(e) => setFormData({...formData, cacNumber: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Vendor Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendorModal;