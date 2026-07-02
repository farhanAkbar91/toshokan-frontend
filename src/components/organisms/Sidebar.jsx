import React from 'react';
import { LayoutDashboard, BookOpen, Users, RefreshCw, Moon, Sun, Library, FileText, LogOut, User } from 'lucide-react';

export const Sidebar = ({ activePage, setActivePage, isDark, toggleTheme, currentUser, role, onLogout }) => {
  
  // Define menu items dynamically based on role
  const menuItems = role === 'admin' 
    ? [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'books', label: 'Koleksi Buku', icon: BookOpen },
        { id: 'members', label: 'Data Anggota', icon: Users },
        { id: 'circulation', label: 'Sirkulasi', icon: RefreshCw },
        { id: 'reports', label: 'Laporan', icon: FileText },
      ]
    : [
        { id: 'books', label: 'Katalog Buku', icon: BookOpen },
        { id: 'myloans', label: 'Peminjamanku', icon: RefreshCw },
      ];

  return (
    <aside className="w-64 h-screen bg-bg-surface border-r border-border-base flex flex-col justify-between py-6 px-4 shrink-0">
      <div className="flex flex-col gap-6">
        {/* Logo / Brand Header */}
        <div className="flex items-center gap-3 px-3">
          <div className="p-2 bg-brand-primary text-white rounded-xl shadow-md shadow-brand-primary/20">
            <Library className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-txt-base tracking-tight leading-none">Toshokan</h1>
            <span className="text-[10px] font-bold text-brand-accent tracking-widest uppercase mt-1">Sistem Perpustakaan</span>
          </div>
        </div>

        {/* User Info Profile Widget */}
        {currentUser && (
          <div className="flex items-center gap-3 px-3 py-3 bg-bg-base/60 dark:bg-slate-900/30 rounded-xl border border-border-base/40">
            <div className="p-2 bg-slate-200 dark:bg-slate-700 text-txt-base rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-txt-base truncate">{currentUser.nama}</span>
              <span className="text-[9px] font-semibold text-brand-primary uppercase tracking-wider mt-0.5">
                {role === 'admin' ? 'Pustakawan' : 'Anggota'}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/20'
                    : 'text-txt-muted hover:bg-bg-base hover:text-txt-base'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings & Theme Toggle */}
      <div className="flex flex-col gap-2 border-t border-border-base pt-4">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-txt-muted hover:bg-bg-base hover:text-txt-base transition-all duration-200 cursor-pointer select-none border border-border-base/20"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Sun className="w-4 h-4 text-brand-accent" /> : <Moon className="w-4 h-4" />}
            <span className="text-xs">{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg-base border border-border-base text-txt-muted font-bold font-mono">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200 cursor-pointer select-none border border-transparent"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar</span>
        </button>

        <div className="px-4 text-[9px] text-txt-muted text-center font-medium mt-2">
          &copy; 2026 Toshokan App.
        </div>
      </div>
    </aside>
  );
};
