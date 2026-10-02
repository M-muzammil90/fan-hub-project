import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Shield, User, RefreshCw, AlertCircle, Edit2, UserX } from 'lucide-react';
import { adminApi } from '../../services/admin.api';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal & Action states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionBusy, setIsActionBusy] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUsers();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch registered users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminApi.updateUser(userId, { role: newRole });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => ((u.id || u._id) === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    const userId = selectedUser.id || selectedUser._id;
    setIsActionBusy(true);
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== userId));
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    } finally {
      setIsActionBusy(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">
            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Platform Users</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            View registered user accounts, manage admin privileges, and inspect member roles.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs font-semibold text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or email..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchUsers} className="underline hover:text-white">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <RefreshCw className="w-8 h-8 text-red-400 animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400">Loading registered users from server...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
          <UserX className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-sm font-bold text-zinc-400">No matching user accounts found</p>
          <p className="text-xs text-zinc-600">Try clearing search filters or registering new accounts.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-950 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/60 border-b border-white/10 text-zinc-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-4 px-5">User Profile</th>
                <th className="py-4 px-4">Email Address</th>
                <th className="py-4 px-4">Account Role</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {filteredUsers.map((u) => {
                const uId = u.id || u._id;
                return (
                  <tr key={uId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover bg-zinc-950 border border-white/10"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-red-400 font-bold flex items-center justify-center border border-red-500/30">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">ID: {uId}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(uId, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none transition-colors ${
                          u.role === 'admin'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-black text-zinc-300 border border-white/10'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(u);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User Account?"
        message={`Are you sure you want to delete user "${selectedUser?.name}" (${selectedUser?.email})? This action cannot be reversed.`}
        confirmText="Delete Account"
        isLoading={isActionBusy}
      />
    </div>
  );
}
