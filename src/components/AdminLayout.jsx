import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { AdminChromeProvider } from '../context/AdminChromeContext';

function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen bg-black text-zinc-100 flex flex-col">
      <AdminNavbar onMenuOpen={() => setMobileOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <AdminSidebar isMobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminChromeProvider>
      <AdminShell />
    </AdminChromeProvider>
  );
}
