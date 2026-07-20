import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UsersIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
  ArrowLeftIcon, XMarkIcon, ShieldCheckIcon, UserIcon, EnvelopeIcon, PhoneIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== userId));
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.email || !addForm.password) {
      toast.error('Please fill all required fields');
      return;
    }
    setAddLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(addForm)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('User created successfully');
        setAddForm({ name: '', email: '', password: '', phone: '', role: 'customer' });
        setShowAddModal(false);
        fetchUsers();
      } else {
        toast.error(data.message || 'Failed to create user');
      }
    } catch (error) {
      toast.error('Failed to create user');
    } finally {
      setAddLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.role === 'admin').length;
  const customerCount = users.filter(u => u.role === 'customer').length;

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400 mt-1">{users.length} total users</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/20">
            <PlusIcon className="h-5 w-5" />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/80 rounded-2xl border border-white/10 p-5">
            <UsersIcon className="h-8 w-8 text-purple-400 mb-3" />
            <p className="text-3xl font-bold text-white">{users.length}</p>
            <p className="text-gray-400 text-sm">Total Users</p>
          </div>
          <div className="bg-gray-900/80 rounded-2xl border border-white/10 p-5">
            <ShieldCheckIcon className="h-8 w-8 text-blue-400 mb-3" />
            <p className="text-3xl font-bold text-white">{adminCount}</p>
            <p className="text-gray-400 text-sm">Admins</p>
          </div>
          <div className="bg-gray-900/80 rounded-2xl border border-white/10 p-5 col-span-2 sm:col-span-1">
            <UserIcon className="h-8 w-8 text-emerald-400 mb-3" />
            <p className="text-3xl font-bold text-white">{customerCount}</p>
            <p className="text-gray-400 text-sm">Customers</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-gray-900/80 rounded-2xl border border-white/10 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all" />
          </div>
          <div className="flex gap-2">
            {['all', 'admin', 'customer'].map(role => (
              <button key={role} onClick={() => setFilterRole(role)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  filterRole === role
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/80 rounded-2xl border border-white/10">
            <UsersIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search or filter</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-gray-900/80 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Phone</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          }`}>
                            <span className="text-white font-bold text-sm">{u.name?.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="text-white font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{u.email}</td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{u.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {u.role === 'admin' && <ShieldCheckIcon className="h-3 w-3" />}
                          {u.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button onClick={() => handleDeleteUser(u._id, u.name)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                            title="Delete user">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filteredUsers.map((u) => (
                <div key={u._id} className="bg-gray-900/80 rounded-2xl border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}>
                        <span className="text-white font-bold text-sm">{u.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{u.name}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name *</label>
                <input type="text" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email *</label>
                <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password *</label>
                <input type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Phone</label>
                <input type="tel" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Role</label>
                <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all">
                  <option value="customer" className="bg-gray-900">Customer</option>
                  <option value="admin" className="bg-gray-900">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-gray-400 font-semibold hover:bg-white/5 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={addLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {addLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersPage;
