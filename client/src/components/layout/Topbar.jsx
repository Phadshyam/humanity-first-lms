import React, { useState, useRef, useEffect } from 'react';
import { Menu, User as UserIcon, ChevronDown, LogOut, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'HF';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'trainer':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'field_worker':
      case 'volunteer':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const formatRoleLabel = (role) => {
    if (!role) return 'Volunteer';
    if (role === 'admin') return 'Admin';
    if (role === 'trainer') return 'Trainer';
    if (role === 'field_worker') return 'Field Worker';
    return 'Volunteer';
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-line-border px-6 py-3.5 flex items-center justify-between">
      {/* Left Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg bg-alt-bg text-ink hover:bg-line-border transition cursor-pointer border-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base md:text-lg font-bold font-heading text-ink hidden sm:block">
          Humanity First LMS
        </h1>
      </div>

      {/* Right User Profile Card & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {user ? (
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 bg-white hover:bg-neutral-50/80 border border-neutral-200/80 rounded-xl px-3.5 py-2 shadow-xs transition-all cursor-pointer select-none group"
          >
            {/* Avatar with Online Status Dot */}
            <div className="relative shrink-0">
              <span className="w-9 h-9 rounded-full bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center shadow-xs font-mono">
                {getInitials(user.name)}
              </span>
              <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5"></span>
            </div>

            {/* User Info Stack */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-sm font-semibold text-neutral-800 leading-tight truncate max-w-[140px]">
                {user.name}
              </span>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded border uppercase mt-0.5 w-fit ${getRoleBadgeStyle(user.role)}`}>
                {formatRoleLabel(user.role)}
              </span>
            </div>

            {/* Chevron Icon */}
            <ChevronDown className={`w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-neutral-200">
            <UserIcon className="w-5 h-5 text-muted-text" />
            <span className="text-xs font-medium text-muted-text">Guest User</span>
          </div>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && user && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2.5 border-b border-neutral-100 space-y-1">
              <p className="text-xs font-bold text-neutral-800 truncate">{user.name}</p>
              <p className="text-[11px] font-mono text-neutral-500 truncate flex items-center gap-1">
                <Mail className="w-3 h-3" /> {user.email}
              </p>
            </div>

            <div className="px-2 py-1">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
