import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark transition-colors duration-300">
      {/* The old Navbar and Footer are removed from here */}
      {children}
    </div>
  );
};

export default Layout;