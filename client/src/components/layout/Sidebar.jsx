import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Award, 
  ShieldCheck, 
  Globe, 
  LogOut,
  X,
  Zap,
  WifiOff
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useBandwidth } from '../../context/BandwidthContext';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { t, language, cycleLanguage } = useLanguage();
  const { isLowBandwidth, toggleLowBandwidth } = useBandwidth();

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
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-forest-green text-surface rounded-lg shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-terracotta uppercase">Humanity First</span>
              <h2 className="text-base font-extrabold font-heading text-forest-green leading-none">LEARNING HUB</h2>
            </div>
          </div>

          {/* Close drawer button for mobile */}
          {setMobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-muted-text hover:text-ink"
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

      {/* Footer Controls: Data Saver Toggle, Language Toggle & Logout */}
      <div className="pt-4 border-t border-line-border space-y-2">
        {/* Data Saver Mode Toggle Button */}
        <button
          onClick={toggleLowBandwidth}
          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition border ${
            isLowBandwidth 
              ? 'bg-terracotta-soft text-terracotta border-terracotta/30' 
              : 'bg-alt-bg text-ink border-line-border hover:bg-line-border'
          }`}
          title="Toggle low bandwidth mode to disable video streaming"
        >
          <span className="flex items-center gap-1.5">
            {isLowBandwidth ? <WifiOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 text-forest-green" />}
            Data Saver
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
            isLowBandwidth ? 'bg-terracotta text-surface' : 'bg-surface text-muted-text border border-line-border'
          }`}>
            {isLowBandwidth ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Language Switcher */}
        <button
          onClick={cycleLanguage}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-alt-bg text-ink text-xs font-bold font-mono hover:bg-line-border transition"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-forest-green" /> Language
          </span>
          <span className="px-2 py-0.5 bg-surface text-forest-green rounded font-semibold border border-line-border uppercase">
            {language}
          </span>
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-terracotta hover:bg-terracotta-soft text-xs font-bold transition"
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
