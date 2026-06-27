import React from 'react';
import { LayoutDashboard, BookOpen, Users, RefreshCw, Moon, Sun, Library } from 'lucide-react';

export const Sidebar = ({ activePage, setActivePage, isDark, toggleTheme }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Koleksi Buku', icon: BookOpen },
    { id: 'members', label: 'Data Anggota', icon: Users },
    { id: 'circulation', label: 'Sirkulasi', icon: RefreshCw },
  ];

  return (
    <aside className="w-64 h-screen bg-bg-surface border-r border-border-base flex flex-col justify-between py-6 px-4 shrink-0">
      <div className="flex flex-col gap-8">
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
      <div className="flex flex-col gap-4 border-t border-border-base pt-4">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold text-txt-muted hover:bg-bg-base hover:text-txt-base transition-all duration-200 cursor-pointer select-none border border-border-base/40"
        >
          <div className="flex items-center gap-3">
            {isDark ? <Sun className="w-5 h-5 text-brand-accent" /> : <Moon className="w-5 h-5" />}
            <span>{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-base border border-border-base text-txt-muted">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>
        <div className="px-4 text-[10px] text-txt-muted text-center font-medium">
          &copy; 2026 Toshokan App.
        </div>
      </div>
    </aside>
  );
};
