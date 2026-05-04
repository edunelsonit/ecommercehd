

const UserManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Add New User</button>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-500 italic text-center py-10">User list data will load here...</p>
      </div>
    </div>
  )
}

export default UserManagement