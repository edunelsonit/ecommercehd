import { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, User as Mail, Phone } from 'lucide-react';
import api from '../../../api/axios';
import AddVendorModal from './AddVendorModal'; // Adjust path if needed

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

 // 1. Start with loading as true
const [loading, setLoading] = useState(true); 

const fetchUsers = async () => {
  // 2. Remove the synchronous setLoading(true) from here
  try {
    const res = await api.get('/api/admin/users');
    setUsers(res.data.data || []);
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    setLoading(false); // 3. This is async, so it's allowed!
  }
};

useEffect(() => {
  fetchUsers();
}, []);

  // Helper for role badges
  const getRoleBadge = (role) => {
    const styles = {
      superadmin: "bg-rose-100 text-rose-700 border-rose-200",
      admin: "bg-amber-100 text-amber-700 border-amber-200",
      vendor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      rider: "bg-emerald-100 text-emerald-700 border-emerald-200",
      customer: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return styles[role?.toLowerCase()] || styles.customer;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">Manage your platform users and promote them to Vendor status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-100"
        >
          <UserPlus size={18} />
          Add Vendor Profile
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">
                    No users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-white shadow-sm font-bold">
                          {user.firstName?.[0]}{user.surname?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{user.firstName} {user.surname}</p>
                          <p className="text-xs text-slate-400 font-mono uppercase tracking-tighter">UID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          {user.phone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusable Modal */}
      <AddVendorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchUsers} 
      />
    </div>
  );
};

export default UserManagement;