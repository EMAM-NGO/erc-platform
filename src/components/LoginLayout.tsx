import { useRef } from 'react';
import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import ThemeSwitcher from './ThemeSwitcher';
import DataScienceSnippet from './DataScienceSnippet';
import logo from '../assets/emam-logo.png';
import { useParallax } from '../hooks/useParallax';

// SVG component for the background data grid (no changes)
const DataGridBackground = () => (
  <svg className="absolute inset-0 w-full h-full z-0 opacity-5 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="2.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

// 3. The component signature is simplified to not accept props
const LoginLayout: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallax = useParallax(parallaxRef);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 transition-colors duration-500 overflow-hidden relative" ref={parallaxRef}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-gray-50 dark:bg-gray-900">
        <DataGridBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent dark:from-emam-green dark:via-transparent dark:to-transparent opacity-20"></div>
        <div style={{ transform: `translate(${parallax.x * -20}px, ${parallax.y * -20}px)` }} className="absolute top-[20%] left-[5%] w-24 h-24 bg-emam-green rounded-lg opacity-5 dark:opacity-10 animate-float-around"></div>
        <div style={{ transform: `translate(${parallax.x * 15}px, ${parallax.y * 15}px)` }} className="absolute bottom-[10%] right-[5%] w-32 h-32 border-2 border-emam-accent rounded-full opacity-5 dark:opacity-10 animate-float-around [animation-duration:12s]"></div>
        <div style={{ transform: `translate(${parallax.x * -10}px, ${parallax.y * -10}px)` }} className="absolute bottom-[25%] left-[15%] w-48 h-48 border-4 border-emam-green rounded-xl opacity-5 dark:opacity-10 animate-float-around [animation-duration:18s]"></div>
        <div style={{ transform: `translate(${parallax.x * 25}px, ${parallax.y * 25}px)` }} className="absolute top-[15%] right-[10%] w-20 h-20 bg-emam-accent rounded-full opacity-5 dark:opacity-10 animate-float-around"></div>
      </div>

      {/* Left Column: Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-transparent z-10 space-y-8">
        <div className="text-center relative">
          <div style={{ transform: `translate(${parallax.x * -30}px, ${parallax.y * -30}px)` }} className="absolute inset-0 flex justify-center items-center">
            <div className="w-48 h-48 bg-emam-accent rounded-full opacity-10 dark:opacity-20 blur-xl"></div>
          </div>
          <img className="h-28 w-auto mx-auto mb-6 relative" src={logo} alt="EMAM Logo" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center transition-colors duration-500 relative">
            EMAM Research Center
          </h1>
        </div>
        <DataScienceSnippet />
      </div>

      {/* Right Column: Content with a Left Border */}
      <div className="flex flex-col h-screen relative z-10 bg-transparent lg:border-l lg:border-gray-200 lg:dark:border-gray-700">
        <header className="lg:hidden bg-white/70 dark:bg-black/50 backdrop-blur-sm shadow-md sticky top-0 z-20 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <img className="h-12 w-auto" src={logo} alt="EMAM Research Center Logo" />
                <span className="font-semibold text-lg text-gray-700 dark:text-gray-100 transition-colors duration-500">
                  EMAM Research Center Gate
                </span>
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <div className="hidden lg:block absolute top-6 right-6 z-20">
          <ThemeSwitcher />
        </div>

        <main className="flex-grow flex flex-col justify-center items-center p-8">
          <Outlet /> {/* 4. Use Outlet here instead of {children} */}
        </main>
      </div>
    </div>
  );
};

export default LoginLayout;