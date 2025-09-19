import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import logo from '../assets/emam-logo.png';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useUser } from '../context/UserContext';

const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { handleLogout } = useLogout();
  const { user } = useUser();

  const isActive = (path: string) => {
    const fullPath = `/admin${path}`;
    // Handle index route for /admin
    if (path === '' || path === '/') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(fullPath);
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <aside 
        className={`bg-card-light dark:bg-card-dark flex-shrink-0 p-6 flex flex-col justify-between z-10 shadow-lg transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* --- CHANGE: Header updated for new button placement --- */}
          <div className="flex items-center justify-between mb-10 min-w-0">
            {/* Left side: Logo and Title */}
            <div className="flex items-center space-x-3 min-w-0">
              <img className="h-12 w-12 flex-shrink-0" src={logo} alt="EMAM Logo" />
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <span className="font-bold text-lg text-text-main-light dark:text-text-main-dark truncate">Admin Panel</span>
                </div>
              )}
            </div>

            {/* Right side: Collapse Button */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
              className="p-2 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          {/* --- END OF CHANGE --- */}

          <nav className="space-y-4">
            <Link to="/admin/users" title="Manage Users" className={`flex items-center p-2 rounded-lg ${isActive('/users') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">U</span>
              <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Users</span>
            </Link>
             <Link to="/admin/content" title="Manage Content" className={`flex items-center p-2 rounded-lg ${isActive('/content') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">C</span>
               <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Content</span>
             </Link>
          </nav>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Link to="/" title="View User Dashboard" className={`flex items-center p-2 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 mb-4`}>
            <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">→</span>
            <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>User Site</span>
          </Link>

          <div className={`flex items-center justify-between mb-4 transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
            <span className="text-text-muted-light dark:text-text-muted-dark">{user ? `${user.fname} ${user.lname}` : 'Admin'}</span>
            <ThemeSwitcher />
          </div>

          <div className="mt-auto">
              <button
                onClick={handleLogout}
                title="Log Out"
                className="flex items-center w-full p-2 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="w-6 h-6 mr-3 flex items-center justify-center">
                  <i className="fas fa-sign-out-alt"></i>
                </span>
                <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                  Log Out
                </span>
              </button>
            </div>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
