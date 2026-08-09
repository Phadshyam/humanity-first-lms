import React, { useState } from 'react';
import { Users, Mail, UserPlus, Trash2, X, Check } from 'lucide-react';
import Badge from '../common/Badge';

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
    <div className="bg-[#FFFDF7] p-6 rounded-2xl border border-[#D4CEC0] space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-extrabold font-heading text-[#24302B] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#176B4D]" /> Registered users
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-extrabold text-[#C96B3C] bg-[#E9E4D8] px-2.5 py-1 rounded">
            {users.length} RECORDS
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#176B4D] hover:bg-[#C96B3C] text-[#FFFDF7] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {users && users.length > 0 ? (
          users.map((user) => {
            const isSelf = currentUser && (currentUser._id === user._id || currentUser.email === user.email);

            return (
              <div
                key={user._id || user.email}
                className="p-4 rounded-xl bg-[#F5F1E8] border border-[#D4CEC0] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Terracotta Soft Avatar Circle */}
                  <div className="w-9 h-9 rounded-xl bg-[#F0D4C3] text-[#C96B3C] font-extrabold text-xs flex items-center justify-center font-mono shrink-0 border border-[#C96B3C]/20">
                    {getInitial(user.name)}
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-bold font-heading text-[#24302B] truncate text-sm flex items-center gap-1">
                      {user.name}
                      {isSelf && (
                        <span className="text-[10px] bg-[#176B4D]/10 text-[#176B4D] font-mono px-1.5 py-0.5 rounded shrink-0">
                          (You)
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] font-mono text-[#5C665F] truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#5C665F]" /> {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={user.role || 'volunteer'}
                    onChange={(e) => onUpdateRole && onUpdateRole(user._id, e.target.value)}
                    className="text-[11px] font-mono font-semibold bg-[#FFFDF7] border border-[#D4CEC0] text-[#24302B] py-1 px-2 rounded-md outline-none focus:border-[#176B4D] cursor-pointer"
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
                      className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-6 text-center text-xs text-[#5C665F] bg-[#F5F1E8] rounded-xl border border-[#D4CEC0]">
            No registered users found in directory.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFDF7] border border-[#D4CEC0] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4CEC0] pb-3">
              <h4 className="text-base font-extrabold font-heading text-[#24302B] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#176B4D]" /> Add New User Manually
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#5C665F] hover:text-[#24302B] p-1 rounded-lg hover:bg-[#E9E4D8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#24302B] mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-2.5 bg-[#FFFDF7] border border-[#D4CEC0] rounded-lg outline-none focus:border-[#176B4D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#24302B] mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. rahul@humanityfirst.org"
                  className="w-full p-2.5 bg-[#FFFDF7] border border-[#D4CEC0] rounded-lg outline-none focus:border-[#176B4D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#24302B] mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 8 chars with number/special char"
                  className="w-full p-2.5 bg-[#FFFDF7] border border-[#D4CEC0] rounded-lg outline-none focus:border-[#176B4D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#24302B] mb-1">Assigned Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-[#FFFDF7] border border-[#D4CEC0] rounded-lg outline-none focus:border-[#176B4D]"
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="field_worker">Field Worker</option>
                  <option value="trainer">Trainer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D4CEC0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#D4CEC0] text-[#5C665F] font-semibold hover:bg-[#E9E4D8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#176B4D] hover:bg-[#C96B3C] text-[#FFFDF7] font-semibold disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
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
