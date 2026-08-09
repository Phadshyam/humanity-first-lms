import React, { useState } from 'react';
import { Users, Mail, UserPlus, Trash2, X, Check } from 'lucide-react';

const UserDirectory = ({ users = [], onAddUser, onUpdateRole, onDeleteUser, currentUser }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please fill in name, email, and password');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      if (onAddUser) {
        await onAddUser(formData);
      }
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'volunteer' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-bold font-heading text-neutral-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-700" /> Registered users
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 font-semibold text-xs rounded-lg">
            {users.length} Records
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 border-0 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {users && users.length > 0 ? (
          users.map((user) => {
            const isSelf = currentUser && (currentUser._id === user._id || currentUser.email === user.email);

            return (
              <div
                key={user._id || user.email}
                className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Emerald Circular Initials Avatar */}
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0 font-mono">
                    {getInitial(user.name)}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold font-heading text-neutral-900 truncate text-sm flex items-center gap-1">
                      {user.name}
                      {isSelf && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono px-1.5 py-0.5 rounded shrink-0">
                          (You)
                        </span>
                      )}
                    </h4>
                    <p className="text-xs font-mono text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-neutral-400" /> {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={user.role || 'volunteer'}
                    onChange={(e) => onUpdateRole && onUpdateRole(user._id, e.target.value)}
                    className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-semibold bg-white text-neutral-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="field_worker">Field Worker</option>
                    <option value="trainer">Trainer</option>
                    <option value="admin">Admin</option>
                  </select>

                  {!isSelf && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
                          if (onDeleteUser) onDeleteUser(user._id);
                        }
                      }}
                      title="Delete User"
                      className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-6 text-center text-xs text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-200">
            No registered users found in directory.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h4 className="text-base font-bold font-heading text-neutral-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" /> Add New User Manually
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition cursor-pointer border-0 bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. rahul@humanityfirst.org"
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 8 chars with number/special char"
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Assigned Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="field_worker">Field Worker</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 font-semibold hover:bg-neutral-100 transition border-0 bg-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer border-0 shadow-xs"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;
