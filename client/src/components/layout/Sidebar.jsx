import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  ShieldCheck, 
  Globe, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { t, language, cycleLanguage } = useLanguage();

  const isTrainerOrAdmin = user && (user.role === 'trainer' || user.role === 'admin');

  const navItemClass = ({ isActive }) => `
    flex items-center gap-3 px-4 py-3 text-sm font-semibold transition rounded-xl
    ${isActive 
      ? 'bg-green-soft text-forest-green border-l-4 border-forest-green shadow-xs font-bold' 
      : 'text-ink hover:bg-alt-bg hover:text-forest-green'}
  `;

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 bg-surface border-r border-line-border w-[248px]">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-line-border pt-2">
          <a href="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-xl bg-[#14583E] border border-[#F0C1A8]/30 flex items-center justify-center shadow-inner shrink-0">
              <svg className="w-5 h-5 text-[#F0C1A8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <b className="block text-sm font-bold tracking-tight font-heading text-[#176B4D] leading-none">Humanity First</b>
              <small className="block font-mono text-[9px] tracking-widest text-[#C96B3C] uppercase mt-1 font-bold">
                LEARNING HUB
              </small>
            </div>
          </a>

          {/* Close drawer button for mobile */}
          {setMobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-muted-text hover:text-ink cursor-pointer border-0 bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Section 1: YOUR SPACE */}
        <div className="space-y-1 mb-8">
          <div className="px-3 mb-2 text-xs font-extrabold font-heading text-muted-text uppercase tracking-wider">
            {t('YOUR_SPACE')}
          </div>

          <NavLink to="/" end className={navItemClass} onClick={() => setMobileOpen && setMobileOpen(false)}>
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('OVERVIEW')}</span>
          </NavLink>

          <NavLink to="/course" className={navItemClass} onClick={() => setMobileOpen && setMobileOpen(false)}>
            <BookOpen className="w-4 h-4" />
            <span>{t('MY_LEARNING')}</span>
          </NavLink>

          <NavLink to="/forum" className={navItemClass} onClick={() => setMobileOpen && setMobileOpen(false)}>
            <Users className="w-4 h-4" />
            <span>{t('COMMUNITY')}</span>
          </NavLink>

          <NavLink to="/certificate" className={navItemClass} onClick={() => setMobileOpen && setMobileOpen(false)}>
            <Award className="w-4 h-4" />
            <span>{t('CERTIFICATE')}</span>
          </NavLink>
        </div>

        {/* Section 2: MANAGE (Trainer / Admin only) */}
        {isTrainerOrAdmin && (
          <div className="space-y-1">
            <div className="px-3 mb-2 text-xs font-extrabold font-heading text-muted-text uppercase tracking-wider">
              {t('MANAGE')}
            </div>

            <NavLink to="/admin" className={navItemClass} onClick={() => setMobileOpen && setMobileOpen(false)}>
              <ShieldCheck className="w-4 h-4 text-terracotta" />
              <span>{t('ADMIN_PANEL')}</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer Controls: Language Switcher & Logout */}
      <div className="pt-4 border-t border-neutral-200 space-y-2">
        {/* Language Switcher */}
        <button
          onClick={cycleLanguage}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white/80 text-neutral-600 text-xs font-medium hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" /> Language
          </span>
          <span className="px-2 py-0.5 bg-neutral-100 text-emerald-700 rounded font-mono font-semibold border border-neutral-200 uppercase text-[10px]">
            {language}
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-terracotta hover:bg-terracotta-soft text-xs font-bold transition cursor-pointer border-0 bg-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('LOGOUT')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-ink/50 backdrop-blur-xs" 
            onClick={() => setMobileOpen(false)}
          ></div>
          <div className="relative z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
