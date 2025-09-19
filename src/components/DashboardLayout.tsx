import React, { useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import logo from '../assets/emam-logo.png';
import { useParallax } from '../hooks/useParallax';
import { useLogout } from '../hooks/useLogout';
import { useUser } from '../context/UserContext';

// SVG component for the background data grid (no changes)
const DataGridBackground = () => (
  <svg className="absolute inset-0 w-full h-full z-0 opacity-[0.03] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const DashboardLayout: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax(parallaxRef);
  const location = useLocation();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { handleLogout } = useLogout();
  const { user } = useUser();

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/' || location.pathname === '/home';
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen relative overflow-hidden" ref={parallaxRef}>
      <div className="absolute inset-0 z-0 bg-background-light dark:bg-background-dark">
        <DataGridBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent dark:from-emam-accent/5 dark:via-transparent dark:to-transparent opacity-30"></div>
        <div style={{ transform: `translate(${parallax.x * -20}px, ${parallax.y * -20}px)` }} className="absolute top-[10%] left-[10%] w-24 h-24 bg-emam-green rounded-lg opacity-5 dark:opacity-10 animate-float-around"></div>
        <div style={{ transform: `translate(${parallax.x * 15}px, ${parallax.y * 15}px)` }} className="absolute bottom-[20%] right-[15%] w-32 h-32 border-2 border-emam-accent rounded-full opacity-5 dark:opacity-10 animate-float-around [animation-duration:12s]"></div>
        <div style={{ transform: `translate(${parallax.x * -10}px, ${parallax.y * -10}px)` }} className="absolute top-[30%] right-[5%] w-48 h-48 border-4 border-emam-green rounded-xl opacity-5 dark:opacity-10 animate-float-around [animation-duration:18s]"></div>
        <div style={{ transform: `translate(${parallax.x * 25}px, ${parallax.y * 25}px)` }} className="absolute bottom-[5%] left-[5%] w-20 h-20 bg-emam-accent rounded-full opacity-5 dark:opacity-10 animate-float-around [animation-duration:10s]"></div>
      </div>

      <aside 
        className={`bg-card-light dark:bg-card-dark flex-shrink-0 p-6 flex flex-col justify-between z-10 shadow-lg transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* --- CHANGE: Header updated for new button placement --- */}
          <div className="flex items-center justify-between mb-10 min-w-0">
            {/* Left side: Logo and Title */}
            <div className={`flex items-center space-x-3 min-w-0 transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <img className="h-12 w-12 flex-shrink-0" src={logo} alt="EMAM Logo" />
              <div className="min-w-0">
                <span className="font-bold text-lg text-text-main-light dark:text-text-main-dark truncate">ERC</span>
              </div>
            </div>

            {/* Right side: Collapse Button */}
            <button 
              onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} 
              className="p-2 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          {/* --- END OF CHANGE --- */}

          <nav className="space-y-4">
            {/* Navigation links remain the same */}
            <Link to="/home" title="Home" className={`flex items-center p-2 rounded-lg ${isActive('/home') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">H</span>
              <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Home</span>
            </Link>
             <Link to="/workshops" title="Workshops" className={`flex items-center p-2 rounded-lg ${isActive('/workshops') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">W</span>
               <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Workshops</span>
             </Link>
             <Link to="/sessions" title="Recorded Sessions" className={`flex items-center p-2 rounded-lg ${isActive('/sessions') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">O</span>
               <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Online Sessions</span>
             </Link>
             <Link to="/results" title="Exam Results" className={`flex items-center p-2 rounded-lg ${isActive('/results') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">E</span>
               <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Exam Results</span>
             </Link>
             <Link to="/references" title="References" className={`flex items-center p-2 rounded-lg ${isActive('/references') ? 'text-primary bg-primary/10' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
               <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">R</span>
               <span className={`transition-opacity duration-200 whitespace-nowrap ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>References</span>
             </Link>
          </nav>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      
          <a href="https://www.emamngo.com" target="_blank" rel="noopener noreferrer" title="Main NGO Site" className={`flex items-center p-2 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 mb-4`}>
            <span className="w-6 h-6 mr-3">☍</span>
            <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Main Site</span>
          </a>

          {user?.role === 'admin' && (
            <Link to="/admin" title="Return to Admin Panel" className={`flex items-center p-2 rounded-lg text-text-muted-light dark:text-text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-700 mb-4`}>
              <span className="w-6 h-6 mr-3 flex items-center justify-center font-bold text-lg">→</span>
              <span className={`transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>Admin Panel</span>
            </Link>
          )}

          <div className={`flex items-center justify-between mb-4 transition-opacity duration-200 ${isSidebarCollapsed ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
            <span className="text-text-muted-light dark:text-text-muted-dark">{user ? `${user.fname} ${user.lname}` : 'Guest'}</span>
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

export default DashboardLayout;