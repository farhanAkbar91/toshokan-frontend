import React from 'react';
import { Sidebar } from '../organisms/Sidebar';

export const Layout = ({ children, activePage, setActivePage, isDark, toggleTheme, currentUser, role, onLogout }) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-bg-base text-txt-base">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        role={role}
        onLogout={onLogout}
      />
      <main className="flex-1 h-screen overflow-y-auto px-8 py-6 flex flex-col gap-6 bg-bg-base select-text">
        {children}
      </main>
    </div>
  );
};
