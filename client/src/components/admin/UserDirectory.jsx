import React from 'react';
import { Users, Mail } from 'lucide-react';
import Badge from '../common/Badge';

const UserDirectory = ({ users = [] }) => {
  const getInitial = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-[#FFFDF7] p-6 rounded-2xl border border-[#D4CEC0] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold font-heading text-[#24302B] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#176B4D]" /> Registered users
        </h3>
        <span className="text-xs font-mono font-extrabold text-[#C96B3C] bg-[#E9E4D8] px-2.5 py-1 rounded">
          {users.length} RECORDS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {users && users.length > 0 ? (
          users.map((user) => (
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
                  <h4 className="font-bold font-heading text-[#24302B] truncate text-sm">{user.name}</h4>
                  <p className="text-[11px] font-mono text-[#5C665F] truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#5C665F]" /> {user.email}
                  </p>
                </div>
              </div>

              <Badge role={user.role} className="shrink-0">
                {user.role}
              </Badge>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-6 text-center text-xs text-[#5C665F] bg-[#F5F1E8] rounded-xl border border-[#D4CEC0]">
            No registered users found in directory.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDirectory;
