import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-warm text-ink font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Workspace Area (Margin Left 248px on Desktop) */}
      <div className="flex-1 md:ml-[248px] flex flex-col min-h-screen min-w-0">
        {/* Topbar Header */}
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        {/* Dynamic Page Content View */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
