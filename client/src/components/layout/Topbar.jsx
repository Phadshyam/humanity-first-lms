import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'HF';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-line-border px-6 py-3.5 flex items-center justify-between">
      {/* Left Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg bg-alt-bg text-ink hover:bg-line-border transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base md:text-lg font-bold font-heading text-ink hidden sm:block">
          Humanity First LMS
        </h1>
      </div>

      {/* Right User Chip */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3 bg-bg-warm px-3.5 py-1.5 rounded-full border border-line-border shadow-2xs">
            <span className="w-8 h-8 rounded-full bg-forest-green text-surface font-extrabold text-xs flex items-center justify-center font-mono">
              {getInitials(user.name)}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold font-heading text-ink leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] font-mono text-muted-text">
                {user.email}
              </span>
            </div>
            <Badge role={user.role} className="ml-1 text-[10px] py-0 px-2">
              {user.role}
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-muted-text" />
            <span className="text-xs font-medium text-muted-text">Guest User</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
